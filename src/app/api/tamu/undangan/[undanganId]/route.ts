import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'

type Params = { params: Promise<{ undanganId: string }> }

// GET /api/tamu/undangan/:undanganId — paginated tamu list for an undangan
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

    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'createdAt'],
    )

    const where = {
      undanganId,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.tamu.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.tamu.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get tamu success')
  } catch {
    return serverError()
  }
}
