import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, serverError } from '@/lib/api-response'

// POST /api/admin/undangan/remove-expired — mark expired undangans as REMOVED
// Admin only
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const expired = await prisma.undangan.findMany({
      where: {
        expired: { lte: new Date() },
        status: 'ACTIVE',
      },
      select: { id: true },
      take: 50,
    })

    if (expired.length === 0) {
      return ok({ removed: 0 }, 'No expired undangans found')
    }

    // Mark each as REMOVED with a randomized permalink so the slug is freed up
    await prisma.$transaction(
      expired.map(({ id }) =>
        prisma.undangan.update({
          where: { id },
          data: { status: 'REMOVED', permalink: `removed-${nanoid()}` },
        }),
      ),
    )

    return ok({ removed: expired.length }, `Removed ${expired.length} expired undangans`)
  } catch {
    return serverError()
  }
}
