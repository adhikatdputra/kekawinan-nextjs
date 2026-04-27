import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/undangan/:id/overview — stats: total tamu, hadir, tidak hadir
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params

    const undangan = await prisma.undangan.findUnique({ where: { id } })
    if (!undangan) return notFound('Undangan not found')
    if (!isAdminLevel(auth.level) && undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const [totalTamu, totalHadir, totalTidakHadir] = await prisma.$transaction([
      prisma.tamu.aggregate({
        _sum: { maxInvite: true },
        where: { undanganId: id },
      }),
      prisma.ucapan.aggregate({
        _sum: { attendTotal: true },
        where: { undanganId: id, attend: 'Yes' },
      }),
      prisma.ucapan.aggregate({
        _sum: { attendTotal: true },
        where: { undanganId: id, attend: 'No' },
      }),
    ])

    return ok({
      total_tamu: totalTamu._sum.maxInvite ?? 0,
      total_tamu_hadir: totalHadir._sum.attendTotal ?? 0,
      total_tamu_tidak_hadir: totalTidakHadir._sum.attendTotal ?? 0,
    }, 'Get overview success')
  } catch {
    return serverError()
  }
}
