import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'

// GET /api/undangan/me
// Returns the authenticated user's own undangans + undangans they collaborate on (ACTIVE).
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const sp = request.nextUrl.searchParams
    const { page, limit, search, sortBy, order } = parsePagination(
      sp,
      ['name', 'createdAt', 'expired'],
    )

    // ── Own undangans ─────────────────────────────────────────────────────────
    const ownWhere: Record<string, unknown> = { userId: auth.id }
    if (search) ownWhere.name = { contains: search, mode: 'insensitive' }

    const [ownRows, ownCount] = await prisma.$transaction([
      prisma.undangan.findMany({
        where: ownWhere,
        orderBy: { [sortBy]: order },
        include: {
          content: { select: { dateWedding: true } },
          theme: { select: { componentName: true } },
        },
      }),
      prisma.undangan.count({ where: ownWhere }),
    ])

    // ── Collaborator undangans ─────────────────────────────────────────────────
    const collabRecords = await prisma.undanganCollaborator.findMany({
      where: { userId: auth.id, status: 'ACTIVE' },
      include: {
        undangan: {
          include: {
            content: { select: { dateWedding: true } },
            theme: { select: { componentName: true } },
            user: { select: { fullname: true } },
          },
        },
      },
    })

    const collabRows = collabRecords
      .filter((c) => {
        if (!search) return true
        return c.undangan.name?.toLowerCase().includes(search.toLowerCase())
      })
      .map((c) => ({
        ...c.undangan,
        collaboratorRole: c.role,
        invitedByName: c.undangan.user?.fullname ?? null,
      }))

    // ── Merge & paginate ──────────────────────────────────────────────────────
    // Own undangans get role = 'OWNER', collaborator ones get their role.
    const ownWithRole = ownRows.map((u) => ({ ...u, collaboratorRole: 'OWNER', invitedByName: null }))
    const allRows = [...ownWithRole, ...collabRows]

    // Sort merged list
    allRows.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] as string | number | null
      const bVal = b[sortBy as keyof typeof b] as string | number | null
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return order === 'asc' ? cmp : -cmp
    })

    const totalCount = ownCount + collabRows.length
    const start = (page - 1) * limit
    const paginatedRows = allRows.slice(start, start + limit)

    return ok(paginate(paginatedRows, totalCount, page, limit), 'Get undangan success')
  } catch {
    return serverError()
  }
}
