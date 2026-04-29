import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ undanganId: string }> }

// GET /api/ucapan/undangan/:undanganId/stats
// Returns total hadir, total tidak hadir, total all
// Replaces the two separate getAttendbyUid / getNoAttendbyUid endpoints
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { undanganId } = await params

    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan not found')
    if (!isAdminLevel(auth.level) && undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const [hadir, tidakHadir, total] = await prisma.$transaction([
      prisma.ucapan.aggregate({
        where: { undanganId, attend: 'Yes' },
        _sum: { attendTotal: true },
        _count: { id: true },
      }),
      prisma.ucapan.aggregate({
        where: { undanganId, attend: 'No' },
        _sum: { attendTotal: true },
        _count: { id: true },
      }),
      prisma.ucapan.count({ where: { undanganId } }),
    ])

    return ok({
      total_ucapan: total,
      total_hadir: hadir._sum.attendTotal ?? 0,
      total_tidak_hadir: tidakHadir._sum.attendTotal ?? 0,
      count_hadir: hadir._count.id,
      count_tidak_hadir: tidakHadir._count.id,
    }, 'Get ucapan stats success')
  } catch {
    return serverError()
  }
}
