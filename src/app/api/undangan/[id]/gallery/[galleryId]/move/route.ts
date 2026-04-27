import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string; galleryId: string }> }

// PATCH /api/undangan/:id/gallery/:galleryId/move
// Body: { direction: 'up' | 'down' }
// Swaps rank with adjacent item atomically — no race condition
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, galleryId } = await params

    const body = await request.json()
    const { direction } = body

    if (direction !== 'up' && direction !== 'down') {
      return badRequest("direction must be 'up' or 'down'")
    }

    const item = await prisma.undanganGallery.findUnique({
      where: { id: galleryId },
      include: { undangan: { select: { userId: true } } },
    })
    if (!item) return notFound('Gallery item not found')
    if (item.undanganId !== id) return notFound('Gallery item not found')
    if (!isAdminLevel(auth.level) && item.undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const targetRank = direction === 'up' ? item.rank - 1 : item.rank + 1

    const sibling = await prisma.undanganGallery.findFirst({
      where: { undanganId: id, rank: targetRank },
    })

    if (!sibling) {
      return badRequest(`Cannot move ${direction}: already at the ${direction === 'up' ? 'top' : 'bottom'}`)
    }

    // Swap ranks atomically
    await prisma.$transaction([
      prisma.undanganGallery.update({
        where: { id: item.id },
        data: { rank: targetRank },
      }),
      prisma.undanganGallery.update({
        where: { id: sibling.id },
        data: { rank: item.rank },
      }),
    ])

    return ok(null, `Gallery item moved ${direction}`)
  } catch {
    return serverError()
  }
}
