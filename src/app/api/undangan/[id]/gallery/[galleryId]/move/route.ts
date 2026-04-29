import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string; galleryId: string }> }

// PATCH /api/undangan/:id/gallery/:galleryId/move
// Body: { direction: 'up' | 'down' }
// Renormalizes all ranks after move — handles duplicate/non-contiguous ranks
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

    // Get all items sorted by rank, then createdAt for stable order on equal ranks
    const allItems = await prisma.undanganGallery.findMany({
      where: { undanganId: id },
      orderBy: [{ rank: 'asc' }, { createdAt: 'asc' }],
      include: { undangan: { select: { userId: true } } },
    })

    const currentIndex = allItems.findIndex(i => i.id === galleryId)
    if (currentIndex === -1) return notFound('Gallery item not found')

    const item = allItems[currentIndex]
    if (!isAdminLevel(auth.level) && item.undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const siblingIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (siblingIndex < 0 || siblingIndex >= allItems.length) {
      return badRequest(`Cannot move ${direction}: already at the ${direction === 'up' ? 'top' : 'bottom'}`)
    }

    // Swap positions in the array
    const reordered = [...allItems]
    ;[reordered[currentIndex], reordered[siblingIndex]] = [reordered[siblingIndex], reordered[currentIndex]]

    // Reassign ranks 1..N in the new order
    await prisma.$transaction(
      reordered.map((item, index) =>
        prisma.undanganGallery.update({
          where: { id: item.id },
          data: { rank: index + 1 },
        })
      )
    )

    return ok(null, `Gallery item moved ${direction}`)
  } catch {
    return serverError()
  }
}
