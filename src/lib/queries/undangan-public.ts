import { prisma } from '@/lib/prisma'
import { resolveMediaUrl } from '@/lib/helpers'

/**
 * Fetch public undangan data by permalink directly from the database.
 * Server-only — use this in Server Components and generateMetadata to avoid
 * making an HTTP call back to the own API (which requires an absolute base URL).
 *
 * Returns the same { success, data, message } shape as the API route so that
 * TanStack Query hydration is compatible with the client-side axios fetcher.
 */
export async function getPublicUndanganBySlug(permalink: string) {
  const data = await prisma.undangan.findUnique({
    where: { permalink },
    include: {
      content: true,
      gifts: true,
      gallery: { orderBy: { rank: 'asc' } },
      ucapan: {
        where: { isShow: 1 },
        orderBy: { createdAt: 'desc' },
      },
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

  return { success: true, data, message: 'Get undangan success' }
}
