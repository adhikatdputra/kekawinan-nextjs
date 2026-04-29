import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

// GET /api/bank — list all banks (any authenticated user)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const banks = await prisma.bank.findMany({
      orderBy: { name: 'asc' },
    })

    const resolved = banks.map((b) => ({ ...b, icon: resolveMediaUrl(b.icon) }))

    return ok(resolved, 'Get banks success')
  } catch {
    return serverError()
  }
}
