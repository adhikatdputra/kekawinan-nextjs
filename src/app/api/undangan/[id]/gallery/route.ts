import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
    return { undangan: null, error: forbidden('Access denied') }
  }
  return { undangan, error: null }
}

function resolveGallery(item: { image: string | null; [key: string]: unknown }) {
  return { ...item, image: resolveMediaUrl(item.image as string) }
}

// GET /api/undangan/:id/gallery — list gallery items sorted by rank
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const items = await prisma.undanganGallery.findMany({
      where: { undanganId: id },
      orderBy: { rank: 'asc' },
    })

    return ok(items.map(resolveGallery), 'Get gallery success')
  } catch {
    return serverError()
  }
}

// POST /api/undangan/:id/gallery — add a gallery image (pass Cloudinary URL after uploading via /api/upload)
// Auto-assigns rank = current count + 1
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { image } = body

    if (!image) return badRequest('image URL is required')

    // Assign rank atomically: max existing rank + 1 (safe after deletions)
    const item = await prisma.$transaction(async (tx) => {
      const maxRankItem = await tx.undanganGallery.findFirst({
        where: { undanganId: id },
        orderBy: { rank: 'desc' },
        select: { rank: true },
      })
      const nextRank = (maxRankItem?.rank ?? 0) + 1
      return tx.undanganGallery.create({
        data: {
          id: nanoid(),
          undanganId: id,
          image,
          rank: nextRank,
        },
      })
    })

    return created(resolveGallery(item as unknown as { image: string | null; [key: string]: unknown }), 'Gallery image added successfully')
  } catch {
    return serverError()
  }
}
