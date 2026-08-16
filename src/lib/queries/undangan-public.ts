import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { resolveMediaUrl } from '@/lib/helpers'

// Cache tag helper — shared with the revalidation helper so mutations can
// invalidate the exact cache entry for a given invitation.
export const undanganCacheTag = (permalink: string) => `undangan:${permalink}`

// Raw DB read. Kept separate so it can be wrapped by unstable_cache.
async function queryPublicUndanganBySlug(permalink: string) {
  const data = await prisma.undangan.findUnique({
    where: { permalink },
    include: {
      content: true,
      gifts: true,
      gallery: { orderBy: { rank: 'asc' } },
      loveStories: { orderBy: { rank: 'asc' } },
      ucapan: {
        where: { isShow: 1 },
        orderBy: { createdAt: 'desc' },
      },
      kado: { orderBy: { createdAt: 'asc' } },
      theme: true,
    },
  })

  if (!data || data.status !== 'ACTIVE') return null

  if (data.content) {
    const c = data.content as Record<string, unknown>
    c.imgBg = resolveMediaUrl(c.imgBg as string)
    c.imgMale = resolveMediaUrl(c.imgMale as string)
    c.imgFemale = resolveMediaUrl(c.imgFemale as string)
    c.imgThumbnail = resolveMediaUrl(c.imgThumbnail as string)
    c.music = resolveMediaUrl(c.music as string, 'video')
  }
  if (data.theme) {
    const t = data.theme as Record<string, unknown>
    t.thumbnail = resolveMediaUrl(t.thumbnail as string)
  }
  for (const g of data.gallery) {
    (g as Record<string, unknown>).image = resolveMediaUrl(g.image)
  }
  for (const ls of data.loveStories) {
    if (ls.image) (ls as Record<string, unknown>).image = resolveMediaUrl(ls.image)
  }
  for (const k of data.kado) {
    if (k.thumbnail) (k as Record<string, unknown>).thumbnail = resolveMediaUrl(k.thumbnail)
  }

  return { success: true, data, message: 'Get undangan success' }
}

/**
 * Fetch public undangan data by permalink directly from the database.
 * Server-only — use this in Server Components and generateMetadata to avoid
 * making an HTTP call back to the own API (which requires an absolute base URL).
 *
 * Wrapped in Vercel Data Cache: repeat visits are served from cache instead of
 * hitting the DB. The entry is tagged `undangan:<permalink>` and revalidated
 * on-demand when the owner edits the invitation (see revalidateUndangan), with
 * a 1-hour time-based safety net.
 *
 * Returns the same { success, data, message } shape as the API route so that
 * TanStack Query hydration is compatible with the client-side axios fetcher.
 */
export function getPublicUndanganBySlug(permalink: string) {
  return unstable_cache(
    () => queryPublicUndanganBySlug(permalink),
    ['undangan-public', permalink],
    { tags: [undanganCacheTag(permalink)], revalidate: 3600 },
  )()
}
