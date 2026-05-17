import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// POST /api/undangan/[id]/attendance — Crew / Owner only (id = permalink/slug)
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: slug } = await params

  try {
    const body = await request.json()
    const { tamuId } = body

    if (!tamuId) return badRequest('tamuId wajib diisi')

    // Cari undangan berdasarkan permalink (slug)
    const undangan = await prisma.undangan.findUnique({
      where: { permalink: slug },
      select: { id: true, userId: true },
    })
    if (!undangan) return notFound('Undangan tidak ditemukan')

    // Validasi caller adalah Owner atau Crew ACTIVE di undangan ini
    const isOwner = undangan.userId === auth.id
    if (!isOwner) {
      const crew = await prisma.undanganCollaborator.findFirst({
        where: {
          undanganId: undangan.id,
          userId: auth.id,
          role: 'CREW',
          status: 'ACTIVE',
        },
      })
      if (!crew) return forbidden('Hanya Owner atau Crew yang dapat mengkonfirmasi kehadiran')
    }

    // Cari tamu dan pastikan milik undangan ini
    const tamu = await prisma.tamu.findUnique({
      where: { id: tamuId },
      select: { id: true, undanganId: true, name: true, maxInvite: true, isConfirm: true, attendedAt: true },
    })
    if (!tamu) return notFound('Tamu tidak ditemukan')
    if (tamu.undanganId !== undangan.id) {
      return badRequest('QR tidak dikenali. Pastikan kamu scan QR dari undangan yang benar.')
    }

    // Cek double confirm
    if (tamu.isConfirm === 1) {
      return ok(
        { alreadyConfirmed: true, attendedAt: tamu.attendedAt, tamu },
        'Tamu ini sudah tercatat hadir.'
      )
    }

    // Konfirmasi kehadiran
    const updated = await prisma.tamu.update({
      where: { id: tamuId },
      data: {
        isConfirm: 1,
        attendedAt: new Date(),
        confirmedBy: auth.id,
      },
      select: { id: true, name: true, maxInvite: true, isConfirm: true, attendedAt: true },
    })

    return ok({ alreadyConfirmed: false, tamu: updated }, 'Kehadiran berhasil dikonfirmasi')
  } catch {
    return serverError()
  }
}
