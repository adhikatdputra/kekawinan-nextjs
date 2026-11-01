import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'
import type { Prisma } from '@prisma/client'

// GET /api/undangan/me
// The authenticated user's own undangans + undangans they collaborate on (ACTIVE),
// paginated in the database as one list.
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'createdAt', 'expired'],
    )

    const where: Prisma.UndanganWhereInput = {
      OR: [
        { userId: auth.id },
        { collaborators: { some: { userId: auth.id, status: 'ACTIVE' } } },
      ],
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.undangan.findMany({
        where,
        // Only `expired` can be null; id as tie-breaker keeps pages stable
        orderBy: [
          sortBy === 'expired' ? { expired: { sort: order, nulls: 'last' } } : { [sortBy]: order },
          { id: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          userId: true,
          permalink: true,
          name: true,
          status: true,
          expired: true,
          themeId: true,
          createdAt: true,
          updatedAt: true,
          packageType: true,
          content: { select: { dateWedding: true } },
          theme: { select: { componentName: true } },
          user: { select: { fullname: true } },
          // This user's own collaborator row, for their role on shared undangans
          collaborators: {
            where: { userId: auth.id, status: 'ACTIVE' },
            select: { role: true },
            take: 1,
          },
          // Jumlah credit yang sudah terpotong untuk undangan ini — dipakai UI
          // pemulihan tema untuk tahu tema mana yang sudah terbayar.
          _count: { select: { userCredits: true } },
        },
      }),
      prisma.undangan.count({ where }),
    ])

    const result = rows.map(({ collaborators, user, ...u }) => {
      const isOwner = u.userId === auth.id
      return {
        ...u,
        collaboratorRole: isOwner ? 'OWNER' : collaborators[0]?.role ?? null,
        invitedByName: isOwner ? null : user?.fullname ?? null,
      }
    })

    return ok(paginate(result, count, page, limit), 'Get undangan success')
  } catch {
    return serverError()
  }
}
