import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'
import { startOfWibDay } from '@/lib/jakarta-day'

// POST /api/auth/activity
// Marks the user as active today. Most users come back on a saved session and
// never hit /signin, so lastLogin alone undercounted daily logins. The client
// calls this at most once per day per browser; the WHERE makes extra calls a
// no-op write.
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await prisma.user.updateMany({
      where: {
        id: auth.id,
        OR: [{ lastLogin: null }, { lastLogin: { lt: startOfWibDay() } }],
      },
      data: { lastLogin: new Date() },
    })
    return ok(null, 'Activity recorded')
  } catch {
    return serverError()
  }
}
