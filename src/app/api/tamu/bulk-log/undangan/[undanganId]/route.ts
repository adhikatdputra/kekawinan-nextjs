import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'
import { isActiveCollaborator } from '@/lib/undangan-access'

type Params = { params: Promise<{ undanganId: string }> }

// GET /api/tamu/bulk-log/undangan/:undanganId — paginated bulk log list
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { undanganId } = await params

    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (
      !isAdminLevel(auth.level) &&
      undangan.userId !== auth.id &&
      !(await isActiveCollaborator(auth.id, undanganId))
    ) {
      return forbidden('Akses ditolak')
    }

    const { page, limit } = parsePagination(request.nextUrl.searchParams, ['createdAt', 'rowNumber'])

    const where = { undanganId }

    const [rows, count] = await prisma.$transaction([
      prisma.tamuBulkLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tamuBulkLog.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get bulk log success')
  } catch (err) {
    console.error('[bulk-log/undangan]', err)
    return serverError()
  }
}
