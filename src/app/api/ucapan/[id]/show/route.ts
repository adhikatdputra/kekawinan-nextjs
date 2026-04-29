import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/ucapan/:id/show — toggle ucapan visibility on public invitation page
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()

    if (body.isShow === undefined || body.isShow === null) {
      return badRequest('isShow is required (0 or 1)')
    }

    const isShow = Number(body.isShow)
    if (isShow !== 0 && isShow !== 1) {
      return badRequest('isShow must be 0 or 1')
    }

    const ucapan = await prisma.ucapan.findUnique({
      where: { id },
      include: { undangan: { select: { userId: true } } },
    })
    if (!ucapan) return notFound('Ucapan not found')
    if (!isAdminLevel(auth.level) && ucapan.undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const updated = await prisma.ucapan.update({
      where: { id },
      data: { isShow },
    })

    return ok(updated, `Ucapan ${isShow === 1 ? 'shown' : 'hidden'}`)
  } catch {
    return serverError()
  }
}
