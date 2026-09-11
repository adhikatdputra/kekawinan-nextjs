import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'
import { revalidateUndanganById } from '@/lib/queries/revalidate-undangan'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string; giftId: string }> }

function resolveGiftBankIcon<T extends { bank?: { icon: string | null } | null }>(gift: T) {
  if (!gift.bank) return gift
  return { ...gift, bank: { ...gift.bank, icon: resolveMediaUrl(gift.bank.icon) } }
}

async function getOwnedGift(giftId: string, undanganId: string, userId: string, level: string) {
  const gift = await prisma.undanganGift.findUnique({
    where: { id: giftId },
    include: { bank: true, undangan: { select: { userId: true } } },
  })
  if (!gift) return { gift: null, error: notFound('Gift not found') }
  if (gift.undanganId !== undanganId) return { gift: null, error: notFound('Gift not found') }
  if (!isAdminLevel(level) && gift.undangan.userId !== userId && !(await isActiveCollaborator(userId, gift.undanganId))) {
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

    return ok(resolveGiftBankIcon(gift), 'Get gift success')
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
    const { bankId, bankName, name, bankNumber, nameAddress, phone, address } = body
    const normalizedBankId = typeof bankId === 'string' && bankId.trim() ? bankId.trim() : null
    const selectedBank = normalizedBankId
      ? await prisma.bank.findUnique({ where: { id: normalizedBankId } })
      : null

    if (normalizedBankId && !selectedBank) {
      return badRequest('bankId is invalid')
    }
    if ((!selectedBank && !bankName) || !name || !bankNumber) {
      return badRequest('bankId or bankName, name, and bankNumber are required')
    }

    const updated = await prisma.undanganGift.update({
      where: { id: giftId },
      data: {
        bankId: selectedBank?.id ?? null,
        bankName: selectedBank?.name ?? bankName.trim(),
        name: name.trim(),
        bankNumber: String(bankNumber).trim(),
        nameAddress: nameAddress?.trim() ?? null,
        phone: phone?.trim() ?? null,
        address: address?.trim() ?? null,
      },
      include: { bank: true },
    })

    await revalidateUndanganById(id)

    return ok(resolveGiftBankIcon(updated), 'Gift updated successfully')
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

    await revalidateUndanganById(id)

    return ok(null, 'Gift deleted successfully')
  } catch {
    return serverError()
  }
}
