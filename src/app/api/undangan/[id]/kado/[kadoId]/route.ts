import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string; kadoId: string }> }

async function getOwnedKado(kadoId: string, undanganId: string, userId: string, level: string) {
  const kado = await prisma.kado.findUnique({
    where: { id: kadoId },
    include: { undangan: { select: { userId: true } } },
  })
  if (!kado) return { kado: null, error: notFound('Kado not found') }
  if (kado.undanganId !== undanganId) return { kado: null, error: notFound('Kado not found') }
  if (!isAdminLevel(level) && kado.undangan.userId !== userId) {
    return { kado: null, error: forbidden('Access denied') }
  }
  return { kado, error: null }
}

function resolveKado(kado: Record<string, unknown>) {
  return { ...kado, thumbnail: resolveMediaUrl(kado.thumbnail as string) }
}

// GET /api/undangan/:id/kado/:kadoId
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, kadoId } = await params
    const { kado, error } = await getOwnedKado(kadoId, id, auth.id, auth.level)
    if (error) return error

    return ok(resolveKado(kado as unknown as Record<string, unknown>), 'Get kado success')
  } catch {
    return serverError()
  }
}

// PUT /api/undangan/:id/kado/:kadoId — partial update (only provided fields are changed)
// Pass thumbnail as a Cloudinary URL string. To clear thumbnail, pass null.
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, kadoId } = await params
    const { error } = await getOwnedKado(kadoId, id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if ('title' in body) data.title = body.title?.trim() ?? null
    if ('description' in body) data.description = body.description?.trim() ?? null
    if ('price' in body) data.price = body.price ? String(body.price).trim() : null
    if ('linkProduct' in body) data.linkProduct = body.linkProduct?.trim() ?? null
    if ('thumbnail' in body) data.thumbnail = body.thumbnail || null // empty string → null

    const updated = await prisma.kado.update({
      where: { id: kadoId },
      data,
    })

    return ok(resolveKado(updated as unknown as Record<string, unknown>), 'Kado updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/undangan/:id/kado/:kadoId
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, kadoId } = await params
    const { error } = await getOwnedKado(kadoId, id, auth.id, auth.level)
    if (error) return error

    await prisma.kado.delete({ where: { id: kadoId } })

    return ok(null, 'Kado deleted successfully')
  } catch {
    return serverError()
  }
}
