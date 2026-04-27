import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string; giftId: string }> }

async function getOwnedGift(giftId: string, undanganId: string, userId: string, level: string) {
  const gift = await prisma.undanganGift.findUnique({
    where: { id: giftId },
    include: { undangan: { select: { userId: true } } },
  })
  if (!gift) return { gift: null, error: notFound('Gift not found') }
  if (gift.undanganId !== undanganId) return { gift: null, error: notFound('Gift not found') }
  if (!isAdminLevel(level) && gift.undangan.userId !== userId) {
    return { gift: null, error: forbidden('Access denied') }
  }
  return { gift, error: null }
}

// GET /api/undangan/:id/gifts/:giftId
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, giftId } = await params
    const { gift, error } = await getOwnedGift(giftId, id, auth.id, auth.level)
    if (error) return error

    return ok(gift, 'Get gift success')
  } catch {
    return serverError()
  }
}

// PUT /api/undangan/:id/gifts/:giftId — full update (all fields required)
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, giftId } = await params
    const { error } = await getOwnedGift(giftId, id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { bankName, name, bankNumber, nameAddress, phone, address } = body

    if (!bankName || !name || !bankNumber) {
      return badRequest('bankName, name, and bankNumber are required')
    }

    const updated = await prisma.undanganGift.update({
      where: { id: giftId },
      data: {
        bankName: bankName.trim(),
        name: name.trim(),
        bankNumber: String(bankNumber).trim(),
        nameAddress: nameAddress?.trim() ?? null,
        phone: phone?.trim() ?? null,
        address: address?.trim() ?? null,
      },
    })

    return ok(updated, 'Gift updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/undangan/:id/gifts/:giftId
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, giftId } = await params
    const { error } = await getOwnedGift(giftId, id, auth.id, auth.level)
    if (error) return error

    await prisma.undanganGift.delete({ where: { id: giftId } })

    return ok(null, 'Gift deleted successfully')
  } catch {
    return serverError()
  }
}
