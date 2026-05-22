export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

// ── Minimal xlsx parser (no external xlsx dep) ───────────────────────────────

function decodeXml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#xA;/g, '\n')
    .replace(/&#x9;/g, '\t')
}

function colToIndex(col: string): number {
  let idx = 0
  for (const ch of col.toUpperCase()) idx = idx * 26 + ch.charCodeAt(0) - 64
  return idx - 1
}

function parseSharedStrings(xml: string): string[] {
  const result: string[] = []
  for (const siMatch of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    const parts: string[] = []
    for (const tMatch of siMatch[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) {
      parts.push(decodeXml(tMatch[1]))
    }
    result.push(parts.join(''))
  }
  return result
}

function parseWorksheet(xml: string, ss: string[]): unknown[][] {
  const rowMap = new Map<number, Map<number, unknown>>()

  for (const rowM of xml.matchAll(/<row\s[^>]*\br="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const rowIdx = parseInt(rowM[1]) - 1
    const colMap = new Map<number, unknown>()

    for (const cellM of rowM[2].matchAll(/<c\s[^>]*\br="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const colIdx = colToIndex(cellM[1])
      const attrs = cellM[2]
      const inner = cellM[3]

      // Inline string
      const inlineM = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/)
      if (/t="inlineStr"/.test(attrs)) {
        colMap.set(colIdx, inlineM ? decodeXml(inlineM[1]) : '')
        continue
      }

      const vM = inner.match(/<v>([\s\S]*?)<\/v>/)
      if (!vM) continue
      const raw = vM[1]

      if (/t="s"/.test(attrs)) {
        colMap.set(colIdx, ss[parseInt(raw)] ?? '')
      } else if (/t="str"/.test(attrs)) {
        colMap.set(colIdx, decodeXml(raw))
      } else if (/t="b"/.test(attrs)) {
        colMap.set(colIdx, raw === '1')
      } else {
        const n = parseFloat(raw)
        colMap.set(colIdx, isNaN(n) ? raw : n)
      }
    }

    rowMap.set(rowIdx, colMap)
  }

  if (rowMap.size === 0) return []
  const maxRow = Math.max(...rowMap.keys())
  const rows: unknown[][] = []

  for (let r = 0; r <= maxRow; r++) {
    const colMap = rowMap.get(r)
    if (!colMap || colMap.size === 0) { rows.push([]); continue }
    const maxCol = Math.max(...colMap.keys())
    const row: unknown[] = new Array(maxCol + 1).fill(undefined)
    colMap.forEach((v, c) => { row[c] = v })
    rows.push(row)
  }

  return rows
}

async function parseXlsx(buffer: Buffer): Promise<{ sheetName: string; rows: unknown[][] }> {
  const zip = await JSZip.loadAsync(buffer)

  // Shared strings
  const ssXml = await zip.file('xl/sharedStrings.xml')?.async('text') ?? ''
  const ss = parseSharedStrings(ssXml)

  // Workbook rels: rId → relative path
  const relsXml = await zip.file('xl/_rels/workbook.xml.rels')?.async('text') ?? ''
  const rIdToPath = new Map<string, string>()
  for (const m of relsXml.matchAll(/Id="(rId\d+)"[^>]*Target="([^"]+)"/g)) {
    rIdToPath.set(m[1], m[2])
  }

  // Sheet list from workbook
  const wbXml = await zip.file('xl/workbook.xml')?.async('text') ?? ''
  const sheets: { name: string; rId: string }[] = []
  // The r: prefix may appear as r:id or without namespace in some tools
  for (const m of wbXml.matchAll(/<sheet\s[^>]*name="([^"]+)"[^>]+(?:r:id|r:Id)="(rId\d+)"/g)) {
    sheets.push({ name: m[1], rId: m[2] })
  }
  if (sheets.length === 0) {
    // Fallback: parse without namespace prefix
    for (const m of wbXml.matchAll(/<sheet\s[^>]*name="([^"]+)"[^/]*/g)) {
      const rIdM = m[0].match(/["']rId(\d+)["']/)
      if (rIdM) sheets.push({ name: m[1], rId: `rId${rIdM[1]}` })
    }
  }

  const targetSheet = sheets.find((s) => s.name.toUpperCase() === 'TAMU') ?? sheets[0]
  if (!targetSheet) throw new Error('No sheets found')

  const relPath = rIdToPath.get(targetSheet.rId)
  const fullPath = relPath
    ? relPath.startsWith('xl/') ? relPath : `xl/${relPath}`
    : 'xl/worksheets/sheet1.xml'

  const sheetXml = await zip.file(fullPath)?.async('text')
  if (!sheetXml) throw new Error('Sheet XML not found')

  return { sheetName: targetSheet.name, rows: parseWorksheet(sheetXml, ss) }
}

// ── Normalizers ───────────────────────────────────────────────────────────────

function normalizePhone(rawPhone: unknown): { phone: string | null; error: string | null } {
  let str = String(rawPhone ?? '').trim()
  if (!str || str === 'undefined' || str === 'null') return { phone: null, error: 'No. WhatsApp wajib diisi' }

  str = str.replace(/\D/g, '')
  if (!str) return { phone: null, error: 'No. WhatsApp tidak valid' }

  if (str.startsWith('8')) str = '0' + str
  if (!str.startsWith('08') && !str.startsWith('62')) {
    return { phone: null, error: 'No. WhatsApp harus diawali 08 atau 62' }
  }

  if (str.startsWith('0')) str = '+62' + str.slice(1)
  else if (str.startsWith('62')) str = '+' + str

  return { phone: str, error: null }
}

function normalizeName(rawName: unknown): { name: string | null; error: string | null } {
  const str = String(rawName ?? '').replace(/&/g, 'dan').replace(/[^\w\s]/gi, '').trim()
  if (!str) return { name: null, error: 'Nama tamu tidak valid' }
  return { name: str, error: null }
}

function normalizeMaxInvite(rawMax: unknown): { maxInvite: number; error: string | null } {
  if (rawMax === undefined || rawMax === null || rawMax === '') return { maxInvite: 1, error: null }
  const num = parseInt(String(rawMax), 10)
  if (isNaN(num) || num < 1 || num > 20) {
    return { maxInvite: 1, error: 'Total tamu harus angka 1-20' }
  }
  return { maxInvite: num, error: null }
}

// ── Route ─────────────────────────────────────────────────────────────────────

// POST /api/tamu/bulk-import
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const formData = await request.formData()
    const undanganId = formData.get('undanganId') as string | null
    const file = formData.get('file') as File | null

    if (!undanganId) return badRequest('undanganId wajib diisi')
    if (!file) return badRequest('File wajib diupload')

    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (
      !isAdminLevel(auth.level) &&
      undangan.userId !== auth.id &&
      !(await isActiveCollaborator(auth.id, undanganId))
    ) {
      return forbidden('Akses ditolak')
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let rows: unknown[][]
    try {
      const parsed = await parseXlsx(buffer)
      rows = parsed.rows
    } catch {
      return badRequest('File tidak dapat dibaca. Pastikan format file adalah .xlsx')
    }

    const dataRows = rows.slice(1) // skip header row

    const validTamu: { id: string; undanganId: string; name: string; phone: string; maxInvite: number }[] = []
    const failedLogs: {
      id: string
      undanganId: string
      batchId: string
      rowNumber: number
      name: string | null
      phone: string | null
      maxInvite: number | null
      errorMessage: string
    }[] = []

    const batchId = nanoid()

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNumber = i + 2

      if (!row || (row as unknown[]).every((cell) => cell === undefined || cell === null || String(cell).trim() === '')) {
        continue
      }

      const rawName = (row as unknown[])[0]
      const rawPhone = (row as unknown[])[1]
      const rawMax = (row as unknown[])[2]

      const { name, error: nameError } = normalizeName(rawName)
      const { phone, error: phoneError } = normalizePhone(rawPhone)
      const { maxInvite, error: maxError } = normalizeMaxInvite(rawMax)

      const errors = [nameError, phoneError, maxError].filter(Boolean)

      if (errors.length > 0) {
        failedLogs.push({
          id: nanoid(),
          undanganId,
          batchId,
          rowNumber,
          name: name ?? (String(rawName ?? '').trim() || null),
          phone: phone ?? (String(rawPhone ?? '').trim() || null),
          maxInvite: maxError ? null : maxInvite,
          errorMessage: errors.join('; '),
        })
      } else {
        validTamu.push({
          id: nanoid(),
          undanganId,
          name: name!,
          phone: phone!,
          maxInvite,
        })
      }
    }

    let successCount = 0
    if (validTamu.length > 0) {
      const result = await prisma.tamu.createMany({
        data: validTamu,
        skipDuplicates: true,
      })
      successCount = result.count
    }

    if (failedLogs.length > 0) {
      await prisma.tamuBulkLog.createMany({
        data: failedLogs,
      })
    }

    return ok(
      {
        success_count: successCount,
        failed_count: failedLogs.length,
        batch_id: batchId,
        total: validTamu.length + failedLogs.length,
      },
      'Import selesai',
    )
  } catch (err) {
    console.error('[bulk-import]', err)
    return serverError()
  }
}
