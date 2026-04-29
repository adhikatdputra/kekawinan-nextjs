import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ permalink: string }> }

// GET /api/undangan/public/:permalink — public invitation page data
// No auth required
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { permalink } = await params

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

    if (!data || data.status !== 'ACTIVE') return notFound('Undangan not found')

    // Resolve Cloudinary URLs
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

    return ok(data, 'Get undangan success')
  } catch {
    return serverError()
  }
}
