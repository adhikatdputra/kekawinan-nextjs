#!/usr/bin/env python3
"""
Migration script: MySQL dump -> Supabase (PostgreSQL) INSERT statements
Handles column renames from snake_case (old) to camelCase (new Prisma schema)
"""

import re
import sys

# Column name mappings per table (old snake_case -> new camelCase)
COLUMN_MAPS = {
    'tbl_images': {
        'content_id': 'contentId',
    },
    'tbl_kado': {
        'undangan_id': 'undanganId',
        'link_product': 'linkProduct',
        'is_confirm': 'isConfirm',
    },
    'tbl_reset_password': {
        'user_id': 'userId',
        'expired_at': 'expiredAt',
    },
    'tbl_tamu': {
        'undangan_id': 'undanganId',
        'send_status': 'sendStatus',
        'max_invite': 'maxInvite',
        'is_read': 'isRead',
        'is_confirm': 'isConfirm',
    },
    'tbl_theme': {
        'component_name': 'componentName',
        'link_url': 'linkUrl',
    },
    'tbl_ucapan': {
        'undangan_id': 'undanganId',
        'attend_total': 'attendTotal',
        'is_show': 'isShow',
    },
    'tbl_undangan': {
        'user_id': 'userId',
        'theme_id': 'themeId',
    },
    'tbl_undangan_content': {
        'undangan_id': 'undanganId',
        'name_male': 'nameMale',
        'name_female': 'nameFemale',
        'date_wedding': 'dateWedding',
        'mother_female': 'motherFemale',
        'father_female': 'fatherFemale',
        'mother_male': 'motherMale',
        'father_male': 'fatherMale',
        'male_no': 'maleNo',
        'female_no': 'femaleNo',
        'akad_time': 'akadTime',
        'akad_place': 'akadPlace',
        'resepsi_time': 'resepsiTime',
        'resepsi_place': 'resepsiPlace',
        'stream_link': 'streamLink',
        'img_bg': 'imgBg',
        'img_male': 'imgMale',
        'img_female': 'imgFemale',
        'img_thumbnail': 'imgThumbnail',
        'is_covid': 'isCovid',
        'religion_version': 'religionVersion',
    },
    'tbl_undangan_gallery': {
        'undangan_id': 'undanganId',
    },
    'tbl_undangan_gift': {
        'undangan_id': 'undanganId',
        'bank_name': 'bankName',
        'bank_number': 'bankNumber',
        'name_address': 'nameAddress',
    },
    'tbl_user_subscriber': {
        'user_id': 'userId',
        'purchase_date': 'purchaseDate',
        'payment_method': 'paymentMethod',
        'purchase_status': 'purchaseStatus',
    },
    'tbl_users': {
        'is_member': 'isMember',
        'expired_member': 'expiredMember',
    },
}

# Desired insert order to respect FK constraints
TABLE_ORDER = [
    'tbl_users',
    'tbl_theme',
    'tbl_undangan',
    'tbl_tamu',
    'tbl_ucapan',
    'tbl_undangan_content',
    'tbl_undangan_gift',
    'tbl_undangan_gallery',
    'tbl_kado',
    'tbl_user_subscriber',
    'tbl_reset_password',
    'tbl_images',
]


def parse_columns(columns_str):
    """Parse MySQL column list, removing backticks."""
    return [c.strip().strip('`') for c in columns_str.split(',')]


def fix_theme_id_values(table_name, columns, values_block):
    """
    For tbl_undangan: replace themeId value '0' with NULL.
    The old schema had theme_id default '0' which is not a valid FK.
    """
    if table_name != 'tbl_undangan':
        return values_block

    try:
        theme_col_idx = columns.index('themeId')
    except ValueError:
        return values_block

    def replace_in_row(m):
        row = m.group(0)
        # Parse row values carefully (simple approach: split by comma respecting quotes)
        inner = row[1:-1]  # remove surrounding parens
        vals = split_values(inner)
        if theme_col_idx < len(vals):
            v = vals[theme_col_idx].strip()
            if v == "'0'" or v == '"0"':
                vals[theme_col_idx] = 'NULL'
        return '(' + ','.join(vals) + ')'

    # Match each row tuple in VALUES block
    result = re.sub(r'\([^)]*\)', replace_in_row, values_block)
    return result


def split_values(s):
    """Split a comma-separated value string, respecting single-quoted strings."""
    vals = []
    current = ''
    in_quote = False
    escape = False
    for ch in s:
        if escape:
            current += ch
            escape = False
        elif ch == '\\':
            current += ch
            escape = True
        elif ch == "'" and not in_quote:
            in_quote = True
            current += ch
        elif ch == "'" and in_quote:
            in_quote = False
            current += ch
        elif ch == ',' and not in_quote:
            vals.append(current)
            current = ''
        else:
            current += ch
    if current:
        vals.append(current)
    return vals


# Boolean columns that need integer -> true/false conversion
BOOLEAN_COLUMNS = {
    'tbl_theme': ['isActive'],
}


def fix_zero_dates(values_block):
    """Replace MySQL zero dates '0000-00-00 00:00:00' with NULL."""
    return values_block.replace("'0000-00-00 00:00:00'", 'NULL').replace("'0000-00-00'", 'NULL')


def fix_boolean_columns(table_name, columns, values_block):
    """Convert integer 0/1 to PostgreSQL boolean true/false for boolean columns."""
    bool_cols = BOOLEAN_COLUMNS.get(table_name, [])
    if not bool_cols:
        return values_block

    bool_indices = [i for i, c in enumerate(columns) if c in bool_cols]
    if not bool_indices:
        return values_block

    def replace_in_row(m):
        inner = m.group(0)[1:-1]
        vals = split_values(inner)
        for idx in bool_indices:
            if idx < len(vals):
                v = vals[idx].strip()
                if v == '1':
                    vals[idx] = 'true'
                elif v == '0':
                    vals[idx] = 'false'
        return '(' + ','.join(vals) + ')'

    return re.sub(r'\((?:[^)(]|\((?:[^)(])*\))*\)', replace_in_row, values_block)


def extract_inserts(content):
    """Extract all INSERT statements grouped by table name."""
    # MySQL INSERT pattern with multi-line values
    pattern = re.compile(
        r"INSERT INTO `(\w+)` \(([^)]+)\) VALUES\n?([\s\S]+?);(?=\s*(?:--|INSERT|CREATE|ALTER|DROP|COMMIT|$))",
        re.MULTILINE
    )

    inserts_by_table = {t: [] for t in TABLE_ORDER}

    for match in pattern.finditer(content):
        table_name = match.group(1)
        if table_name not in COLUMN_MAPS:
            continue
        columns_str = match.group(2)
        values_block = match.group(3).strip().rstrip(',')
        inserts_by_table[table_name].append((columns_str, values_block))

    return inserts_by_table


def fix_mysql_escapes(values_block):
    """
    Convert MySQL escape sequences to PostgreSQL-compatible ones.
    MySQL uses \\' for escaped single quotes; PostgreSQL uses ''.
    Also handle \\n, \\r, \\t which are valid in both but we preserve them.
    We only need to fix \\' -> '' (doubled single quote).
    """
    # Replace \' with '' (PostgreSQL style escaped single quote)
    # We need to be careful not to replace \\\' (escaped backslash + quote)
    result = []
    i = 0
    while i < len(values_block):
        if values_block[i] == '\\' and i + 1 < len(values_block):
            next_ch = values_block[i + 1]
            if next_ch == "'":
                # MySQL \' -> PostgreSQL ''
                result.append("''")
                i += 2
            else:
                # Keep other escape sequences as-is
                result.append(values_block[i])
                i += 1
        else:
            result.append(values_block[i])
            i += 1
    return ''.join(result)


def transform_insert(table_name, columns_str, values_block):
    """Transform a single INSERT statement to PostgreSQL format."""
    col_map = COLUMN_MAPS.get(table_name, {})

    # Parse and rename columns
    old_cols = parse_columns(columns_str)
    new_cols = [col_map.get(col, col) for col in old_cols]

    # Fix MySQL zero dates -> NULL
    values_block = fix_zero_dates(values_block)

    # Fix MySQL escape sequences for PostgreSQL compatibility
    values_block = fix_mysql_escapes(values_block)

    # Fix boolean columns (integer 0/1 -> true/false)
    values_block = fix_boolean_columns(table_name, new_cols, values_block)

    # Fix special cases (e.g., themeId='0' -> NULL)
    values_block = fix_theme_id_values(table_name, new_cols, values_block)

    # Format column list with double quotes for PostgreSQL
    pg_cols = ', '.join(f'"{c}"' for c in new_cols)

    return f'INSERT INTO "{table_name}" ({pg_cols}) VALUES\n{values_block}\nON CONFLICT DO NOTHING;'


def main():
    input_file = 'db_kekawinan_old.sql'
    output_file = 'db_migration_supabase.sql'

    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    print("Extracting INSERT statements...")
    inserts_by_table = extract_inserts(content)

    output_lines = [
        '-- ==============================================',
        '-- Migration: MySQL (kekawinan old) -> Supabase',
        '-- Generated: 2026-04-27',
        '-- Column names: snake_case -> camelCase (Prisma schema)',
        '-- ==============================================',
        '',
        '-- Disable triggers temporarily for faster import',
        'SET session_replication_role = replica;',
        '',
    ]

    total_inserts = 0
    for table_name in TABLE_ORDER:
        table_inserts = inserts_by_table.get(table_name, [])
        if not table_inserts:
            print(f"  {table_name}: no data")
            continue

        output_lines.append(f'-- ==============================')
        output_lines.append(f'-- Table: {table_name}')
        output_lines.append(f'-- ==============================')

        for cols_str, vals_block in table_inserts:
            stmt = transform_insert(table_name, cols_str, vals_block)
            output_lines.append(stmt)
            output_lines.append('')
            total_inserts += 1

        print(f"  {table_name}: {len(table_inserts)} batch(es)")

    output_lines.append('')
    output_lines.append('-- Re-enable triggers')
    output_lines.append('SET session_replication_role = DEFAULT;')
    output_lines.append('')
    output_lines.append('-- Done!')

    print(f"Writing {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))

    print(f"Done! {total_inserts} INSERT statement(s) written to {output_file}")


if __name__ == '__main__':
    main()
