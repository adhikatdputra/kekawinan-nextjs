-- Audit undangan yang themeId-nya NULL.
--
-- Penyebab: PUT /api/undangan/:id dulu menulis `themeId: themeId ?? null`,
-- sementara dialog edit hanya mengirim name + permalink. Setiap kali user
-- rename undangan, temanya ikut terhapus dan halaman publiknya stuck loading.
-- Bug-nya sudah ditutup; query di bawah untuk membereskan data lama.
--
-- Jalankan dengan: psql "$DIRECT_URL" -f scripts/audit-undangan-tanpa-tema.sql

-- 1) Daftar undangan yang temanya hilang, plus berapa credit yang sudah
--    terpotong untuk undangan itu. Jumlah credit = harga tema yang dulu dipilih.
SELECT
  u.id,
  u.permalink,
  u.name,
  u.status,
  usr.email,
  u."createdAt",
  u."updatedAt",
  COUNT(uc.id) AS credit_terpakai
FROM tbl_undangan u
JOIN tbl_users usr ON usr.id = u."userId"
LEFT JOIN tbl_user_credits uc
  ON uc."usedForUndangan" = u.id AND uc.status = 'USED'
WHERE u."themeId" IS NULL
GROUP BY u.id, u.permalink, u.name, u.status, usr.email, u."createdAt", u."updatedAt"
ORDER BY u."createdAt" DESC;

-- 2) Kandidat tema per undangan, dicocokkan dari harga efektif tema
--    (promo kalau ada, kalau tidak pakai credit) terhadap credit yang terpotong.
--    Kalau hasilnya tepat satu baris per undangan, tema itu bisa langsung dipulihkan.
WITH terpakai AS (
  SELECT u.id AS undangan_id, COUNT(uc.id)::int AS cost
  FROM tbl_undangan u
  LEFT JOIN tbl_user_credits uc
    ON uc."usedForUndangan" = u.id AND uc.status = 'USED'
  WHERE u."themeId" IS NULL
  GROUP BY u.id
)
SELECT
  t.undangan_id,
  t.cost,
  th.id AS kandidat_theme_id,
  th.name AS kandidat_theme,
  th."componentName"
FROM terpakai t
JOIN tbl_theme th
  ON COALESCE(th.promo, th.credit) = t.cost
WHERE t.cost > 0
ORDER BY t.undangan_id, th.name;

-- 3) Pemulihan manual — jalankan per undangan setelah temanya dipastikan.
--    UPDATE tbl_undangan SET "themeId" = '<theme-id>' WHERE id = '<undangan-id>';
