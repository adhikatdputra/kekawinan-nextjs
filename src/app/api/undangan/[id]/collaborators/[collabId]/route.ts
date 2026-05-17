import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string; collabId: string }> }

// PATCH /api/undangan/:id/collaborators/:collabId — Owner only, change role
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: undanganId, collabId } = await params

  try {
    const body = await request.json()
    const { role } = body

    if (!role || !['MEMBER', 'CREW'].includes(role)) {
      return badRequest('Role harus MEMBER atau CREW')
    }

    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { userId: true },
    })
    if (!undangan) return badRequest('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat mengubah role kolaborator')

    const collab = await prisma.undanganCollaborator.findFirst({
      where: { id: collabId, undanganId },
    })
    if (!collab) return notFound('Kolaborator tidak ditemukan')

    const updated = await prisma.undanganCollaborator.update({
      where: { id: collabId },
      data: { role },
    })

    return ok(updated, 'Role berhasil diubah')
  } catch {
    return serverError()
  }
}

// DELETE /api/undangan/:id/collaborators/:collabId — Owner only
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: undanganId, collabId } = await params

  try {
    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { userId: true },
    })
    if (!undangan) return badRequest('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat menghapus kolaborator')

    const collab = await prisma.undanganCollaborator.findFirst({
      where: { id: collabId, undanganId },
    })
    if (!collab) return notFound('Kolaborator tidak ditemukan')

    await prisma.undanganCollaborator.delete({ where: { id: collabId } })

    return ok(null, 'Kolaborator berhasil dihapus')
  } catch {
    return serverError()
  }
}
