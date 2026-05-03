import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, serverError } from '@/lib/api-response'
import { sendCollaboratorInviteRegistered, sendCollaboratorInvitePending } from '@/lib/mailer'
import { BASE_URL } from '@/lib/config'

type Params = { params: Promise<{ id: string }> }

// GET /api/undangan/:id/collaborators — Owner only
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: undanganId } = await params

  try {
    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { userId: true },
    })
    if (!undangan) return badRequest('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat melihat kolaborator')

    const collaborators = await prisma.undanganCollaborator.findMany({
      where: { undanganId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { fullname: true, email: true } },
        inviter: { select: { fullname: true } },
      },
    })

    return ok(collaborators, 'Get collaborators success')
  } catch {
    return serverError()
  }
}

// POST /api/undangan/:id/collaborators — Owner only
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: undanganId } = await params

  try {
    const body = await request.json()
    const { email, role } = body

    if (!email || !role) return badRequest('Email dan role wajib diisi')
    if (!['MEMBER', 'CREW'].includes(role)) return badRequest('Role harus MEMBER atau CREW')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badRequest('Format email tidak valid')

    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      include: { user: { select: { fullname: true, email: true } } },
    })
    if (!undangan) return badRequest('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat mengundang kolaborator')

    // Owner cannot invite themselves
    if (undangan.user.email.toLowerCase() === email.toLowerCase()) {
      return badRequest('Kamu tidak bisa mengundang dirimu sendiri')
    }

    // Check if already a collaborator — update role if exists
    const existing = await prisma.undanganCollaborator.findUnique({
      where: { undanganId_email: { undanganId, email: email.toLowerCase() } },
    })
    if (existing) {
      const updated = await prisma.undanganCollaborator.update({
        where: { id: existing.id },
        data: { role },
      })
      return ok(updated, 'Role kolaborator berhasil diubah')
    }

    // Check if email is registered
    const targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, fullname: true },
    })

    const collab = await prisma.undanganCollaborator.create({
      data: {
        id: nanoid(),
        undanganId,
        userId: targetUser?.id ?? null,
        email: email.toLowerCase(),
        role,
        status: targetUser ? 'ACTIVE' : 'PENDING',
        invitedBy: auth.id,
        joinedAt: targetUser ? new Date() : null,
      },
    })

    const baseUrl = BASE_URL

    // Send email notification (fire-and-forget)
    if (targetUser) {
      sendCollaboratorInviteRegistered({
        to: email,
        toName: targetUser.fullname ?? email,
        ownerName: undangan.user.fullname ?? undangan.user.email,
        undanganName: undangan.name ?? 'Undangan Pernikahan',
        role,
        dashboardLink: `${baseUrl}/user/undangan-list`,
      }).catch(() => {})
    } else {
      sendCollaboratorInvitePending({
        to: email,
        ownerName: undangan.user.fullname ?? undangan.user.email,
        undanganName: undangan.name ?? 'Undangan Pernikahan',
        role,
        registerLink: `${baseUrl}/auth/register`,
      }).catch(() => {})
    }

    return created(
      { ...collab, isRegistered: !!targetUser },
      'Kolaborator berhasil diundang',
    )
  } catch {
    return serverError()
  }
}
