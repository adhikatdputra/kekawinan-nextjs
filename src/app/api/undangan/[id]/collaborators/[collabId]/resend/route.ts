import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { sendCollaboratorInvitePending } from '@/lib/mailer'
import { BASE_URL } from '@/lib/config'

type Params = { params: Promise<{ id: string; collabId: string }> }

// POST /api/undangan/:id/collaborators/:collabId/resend — Owner only
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: undanganId, collabId } = await params

  try {
    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      include: { user: { select: { fullname: true, email: true } } },
    })
    if (!undangan) return badRequest('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat mengirim ulang undangan')

    const collab = await prisma.undanganCollaborator.findFirst({
      where: { id: collabId, undanganId },
    })
    if (!collab) return notFound('Kolaborator tidak ditemukan')
    if (collab.status !== 'PENDING') return badRequest('Hanya kolaborator berstatus Pending yang bisa dikirim ulang')

    const baseUrl = BASE_URL

    await sendCollaboratorInvitePending({
      to: collab.email,
      ownerName: undangan.user.fullname ?? undangan.user.email,
      undanganName: undangan.name ?? 'Undangan Pernikahan',
      role: collab.role,
      registerLink: `${baseUrl}/auth/register`,
    })

    return ok(null, 'Email undangan berhasil dikirim ulang')
  } catch {
    return serverError()
  }
}
