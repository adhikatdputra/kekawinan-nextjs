import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'

// GET /api/credits — ambil saldo credit user yang login
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const balance = await prisma.userCredit.count({
      where: { userId: auth.id, status: 'AVAILABLE' },
    })

    return ok({ balance }, 'Get credits success')
  } catch {
    return serverError()
  }
}
