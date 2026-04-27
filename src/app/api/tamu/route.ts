import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

// POST /api/tamu — create tamu
// Verifies that the undangan belongs to the authenticated user
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { undanganId, name, phone, maxInvite } = body

    if (!undanganId || !name || !phone || !maxInvite) {
      return badRequest('undanganId, name, phone, and maxInvite are required')
    }

    const maxInviteNum = Number(maxInvite)
    if (!Number.isInteger(maxInviteNum) || maxInviteNum < 1) {
      return badRequest('maxInvite must be a positive integer')
    }

    // Verify undangan ownership
    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan not found')
    if (!isAdminLevel(auth.level) && undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const tamu = await prisma.tamu.create({
      data: {
        id: nanoid(),
        undanganId,
        name,
        phone,
        maxInvite: maxInviteNum,
      },
    })

    return created(tamu, 'Tamu created')
  } catch {
    return serverError()
  }
}
