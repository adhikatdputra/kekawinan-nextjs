import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// PUT /api/tamu/:id/send — mark tamu as WhatsApp sent
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params

    const tamu = await prisma.tamu.findUnique({
      where: { id },
      include: { undangan: { select: { userId: true } } },
    })
    if (!tamu) return notFound('Tamu not found')
    if (!isAdminLevel(auth.level) && tamu.undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const updated = await prisma.tamu.update({
      where: { id },
      data: { sendStatus: 1 },
    })

    return ok(updated, 'Send status updated')
  } catch {
    return serverError()
  }
}
