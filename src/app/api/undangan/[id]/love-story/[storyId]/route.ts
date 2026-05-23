import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'
import { isActiveCollaborator } from '@/lib/undangan-access'

type Params = { params: Promise<{ id: string; storyId: string }> }

async function getOwnedStory(storyId: string, undanganId: string, userId: string, level: string) {
  const item = await prisma.loveStory.findUnique({
    where: { id: storyId },
    include: { undangan: { select: { userId: true } } },
  })
  if (!item || item.undanganId !== undanganId) return { item: null, error: notFound('Love story tidak ditemukan') }
  if (!isAdminLevel(level) && item.undangan.userId !== userId && !(await isActiveCollaborator(userId, item.undanganId))) {
    return { item: null, error: forbidden('Akses ditolak') }
  }
  return { item, error: null }
}

function resolveItem(item: { image: string | null; [key: string]: unknown }) {
  return { ...item, image: item.image ? resolveMediaUrl(item.image as string) : null }
}

// PUT /api/undangan/:id/love-story/:storyId
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, storyId } = await params
    const { error } = await getOwnedStory(storyId, id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { image, waktu, lokasi, story } = body

    if (story !== undefined && !story?.trim()) return badRequest('Story wajib diisi')

    const updated = await prisma.loveStory.update({
      where: { id: storyId },
      data: {
        ...(image !== undefined && { image: image || null }),
        ...(waktu !== undefined && { waktu: waktu || null }),
        ...(lokasi !== undefined && { lokasi: lokasi || null }),
        ...(story !== undefined && { story }),
      },
    })

    return ok(resolveItem(updated as unknown as { image: string | null; [key: string]: unknown }), 'Love story berhasil diperbarui')
  } catch (err) {
    console.error('[love-story PUT]', err)
    return serverError()
  }
}

// DELETE /api/undangan/:id/love-story/:storyId
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, storyId } = await params
    const { item, error } = await getOwnedStory(storyId, id, auth.id, auth.level)
    if (error) return error

    await prisma.$transaction([
      prisma.loveStory.delete({ where: { id: storyId } }),
      prisma.loveStory.updateMany({
        where: { undanganId: id, rank: { gt: item!.rank } },
        data: { rank: { decrement: 1 } },
      }),
    ])

    return ok(null, 'Love story berhasil dihapus')
  } catch (err) {
    console.error('[love-story DELETE]', err)
    return serverError()
  }
}
