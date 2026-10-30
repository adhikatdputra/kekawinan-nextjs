// Pure helpers (no DB access) so they can be imported anywhere, including the
// cached public query. The DB side lives in claim-permalink.ts.

// Masa aktif undangan: 3 bulan sejak dibuat, atau 2 minggu setelah hari
// pernikahan kalau itu lebih lama (lihat Syarat & Ketentuan dan FAQ).
export const UNDANGAN_ACTIVE_DAYS = 90
export const WEDDING_GRACE_DAYS = 14
// Tanggal pernikahan paling jauh 1 tahun sejak undangan dibuat, supaya tanggal
// palsu di masa depan tidak bisa dipakai untuk memperpanjang masa aktif.
export const MAX_WEDDING_AHEAD_DAYS = 365

const DAY_MS = 24 * 60 * 60 * 1000

export function defaultExpiredDate() {
  return new Date(Date.now() + UNDANGAN_ACTIVE_DAYS * DAY_MS)
}

export function maxWeddingDate(createdAt: Date | string) {
  return new Date(new Date(createdAt).getTime() + MAX_WEDDING_AHEAD_DAYS * DAY_MS)
}

/**
 * Expiry after taking the wedding date into account: the later of the current
 * expiry and wedding + WEDDING_GRACE_DAYS. The wedding date counts only up to
 * maxWeddingDate(createdAt). Never moves the expiry earlier, so an admin
 * extension or a wedding date moved forward doesn't shorten it.
 */
export function expiryWithWedding(
  current: Date | string | null | undefined,
  dateWedding: Date | string | null | undefined,
  createdAt: Date | string,
): Date | null {
  const base = current ? new Date(current) : null
  if (!dateWedding) return base
  const wedding = new Date(dateWedding)
  if (Number.isNaN(wedding.getTime())) return base
  const cap = maxWeddingDate(createdAt)
  const counted = wedding > cap ? cap : wedding
  const afterWedding = new Date(counted.getTime() + WEDDING_GRACE_DAYS * DAY_MS)
  return !base || afterWedding > base ? afterWedding : base
}

export function isUndanganExpired(expired: Date | string | null | undefined) {
  if (!expired) return false
  return new Date(expired).getTime() <= Date.now()
}

// The demo for a theme is the undangan whose permalink is the lowercased
// componentName (Theme1 → theme1). Demos back the /tema pages and the sitemap,
// so they never expire and their slugs can't be claimed.
export function isThemeDemo(undangan: {
  permalink: string
  theme?: { componentName: string | null } | null
}) {
  return undangan.theme?.componentName?.toLowerCase() === undangan.permalink
}

/** Can guests see this undangan? Active status and not past its expiry date. */
export function isUndanganVisible(undangan: {
  permalink: string
  status: string
  expired: Date | string | null
  theme?: { componentName: string | null } | null
}) {
  if (undangan.status !== 'ACTIVE') return false
  return isThemeDemo(undangan) || !isUndanganExpired(undangan.expired)
}
