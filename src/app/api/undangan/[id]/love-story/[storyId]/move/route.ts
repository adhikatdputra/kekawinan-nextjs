import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

type Params = { params: Promise<{ id: string; storyId: string }> }

// PATCH /api/undangan/:id/love-story/:storyId/move
// Body: { direction: 'up' | 'down' }
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, storyId } = await params
    const body = await request.json()
    const { direction } = body

    if (direction !== 'up' && direction !== 'down') {
      return badRequest("direction harus 'up' atau 'down'")
    }

    const allItems = await prisma.loveStory.findMany({
      where: { undanganId: id },
      orderBy: [{ rank: 'asc' }, { createdAt: 'asc' }],
      include: { undangan: { select: { userId: true } } },
    })

    const currentIndex = allItems.findIndex(i => i.id === storyId)
    if (currentIndex === -1) return notFound('Love story tidak ditemukan')

    const item = allItems[currentIndex]
    if (!isAdminLevel(auth.level) && item.undangan.userId !== auth.id && !(await isActiveCollaborator(auth.id, id))) {
      return forbidden('Akses ditolak')
    }

    const siblingIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (siblingIndex < 0 || siblingIndex >= allItems.length) {
      return badRequest(`Tidak bisa dipindahkan ${direction === 'up' ? 'ke atas' : 'ke bawah'}`)
    }

    const reordered = [...allItems]
    ;[reordered[currentIndex], reordered[siblingIndex]] = [reordered[siblingIndex], reordered[currentIndex]]

    await prisma.$transaction(
      reordered.map((item, index) =>
        prisma.loveStory.update({
          where: { id: item.id },
          data: { rank: index + 1 },
        })
      )
    )

    return ok(null, `Love story berhasil dipindahkan`)
  } catch (err) {
    console.error('[love-story move]', err)
    return serverError()
  }
}
