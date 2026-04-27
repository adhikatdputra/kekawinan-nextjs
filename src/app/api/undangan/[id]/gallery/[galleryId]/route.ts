import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string; galleryId: string }> }

async function getOwnedGalleryItem(galleryId: string, undanganId: string, userId: string, level: string) {
  const item = await prisma.undanganGallery.findUnique({
    where: { id: galleryId },
    include: { undangan: { select: { userId: true } } },
  })
  if (!item) return { item: null, error: notFound('Gallery item not found') }
  if (item.undanganId !== undanganId) return { item: null, error: notFound('Gallery item not found') }
  if (!isAdminLevel(level) && item.undangan.userId !== userId) {
    return { item: null, error: forbidden('Access denied') }
  }
  return { item, error: null }
}

function resolveGallery(item: { image: string | null; [key: string]: unknown }) {
  return { ...item, image: resolveMediaUrl(item.image as string) }
}

// GET /api/undangan/:id/gallery/:galleryId
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, galleryId } = await params
    const { item, error } = await getOwnedGalleryItem(galleryId, id, auth.id, auth.level)
    if (error) return error

    return ok(resolveGallery(item as unknown as { image: string | null; [key: string]: unknown }), 'Get gallery item success')
  } catch {
    return serverError()
  }
}

// PUT /api/undangan/:id/gallery/:galleryId — update image URL
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, galleryId } = await params
    const { error } = await getOwnedGalleryItem(galleryId, id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { image } = body

    if (!image) return badRequest('image URL is required')

    const updated = await prisma.undanganGallery.update({
      where: { id: galleryId },
      data: { image },
    })

    return ok(resolveGallery(updated as unknown as { image: string | null; [key: string]: unknown }), 'Gallery item updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/undangan/:id/gallery/:galleryId
// Removes item and closes the rank gap atomically
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, galleryId } = await params
    const { item, error } = await getOwnedGalleryItem(galleryId, id, auth.id, auth.level)
    if (error) return error

    await prisma.$transaction([
      prisma.undanganGallery.delete({ where: { id: galleryId } }),
      // Close rank gap: decrement all items that ranked after the deleted one
      prisma.undanganGallery.updateMany({
        where: { undanganId: id, rank: { gt: item!.rank } },
        data: { rank: { decrement: 1 } },
      }),
    ])

    return ok(null, 'Gallery item deleted successfully')
  } catch {
    return serverError()
  }
}
