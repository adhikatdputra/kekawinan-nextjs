import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

async function getOwnedTamu(id: string, userId: string, level: string) {
  const tamu = await prisma.tamu.findUnique({
    where: { id },
    include: { undangan: { select: { userId: true } } },
  })
  if (!tamu) return { tamu: null, error: notFound('Tamu not found') }
  if (!isAdminLevel(level) && tamu.undangan.userId !== userId) {
    return { tamu: null, error: forbidden('Access denied') }
  }
  return { tamu, error: null }
}

// GET /api/tamu/:id — also marks tamu as read (is_read = 1)
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { tamu, error } = await getOwnedTamu(id, auth.id, auth.level)
    if (error || !tamu) return error!

    // Mark as read — fire and forget, don't fail the request if this fails
    prisma.tamu.update({ where: { id }, data: { isRead: 1 } }).catch(console.error)

    return ok(tamu, 'Get tamu success')
  } catch {
    return serverError()
  }
}

// PUT /api/tamu/:id
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedTamu(id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { name, phone, maxInvite, sendStatus } = body

    if (!name || !phone || !maxInvite) {
      return badRequest('name, phone, and maxInvite are required')
    }

    const maxInviteNum = Number(maxInvite)
    if (!Number.isInteger(maxInviteNum) || maxInviteNum < 1) {
      return badRequest('maxInvite must be a positive integer')
    }

    const updated = await prisma.tamu.update({
      where: { id },
      data: {
        name,
        phone,
        maxInvite: maxInviteNum,
        ...(sendStatus !== undefined && { sendStatus: Number(sendStatus) }),
      },
    })

    return ok(updated, 'Tamu updated')
  } catch {
    return serverError()
  }
}

// DELETE /api/tamu/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedTamu(id, auth.id, auth.level)
    if (error) return error

    await prisma.tamu.delete({ where: { id } })

    return ok(null, 'Tamu deleted')
  } catch {
    return serverError()
  }
}
