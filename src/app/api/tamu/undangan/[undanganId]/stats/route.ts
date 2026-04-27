import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ undanganId: string }> }

// GET /api/tamu/undangan/:undanganId/stats — WA send / read / confirm summary
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

    const result = await prisma.tamu.aggregate({
      where: { undanganId },
      _sum: {
        sendStatus: true,
        isRead: true,
        isConfirm: true,
      },
      _count: { id: true },
    })

    return ok({
      total_tamu: result._count.id,
      total_send: result._sum.sendStatus ?? 0,
      total_read: result._sum.isRead ?? 0,
      total_confirm: result._sum.isConfirm ?? 0,
    }, 'Get stats success')
  } catch {
    return serverError()
  }
}
