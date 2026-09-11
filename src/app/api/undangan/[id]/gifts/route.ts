import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'
import { revalidateUndanganById } from '@/lib/queries/revalidate-undangan'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

function resolveGiftBankIcon<T extends { bank?: { icon: string | null } | null }>(gift: T) {
  if (!gift.bank) return gift
  return { ...gift, bank: { ...gift.bank, icon: resolveMediaUrl(gift.bank.icon) } }
}

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId && !(await isActiveCollaborator(userId, undanganId))) {
    return { undangan: null, error: forbidden('Access denied') }
  }
  return { undangan, error: null }
}

// GET /api/undangan/:id/gifts — list all gift/bank accounts for an undangan
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const gifts = await prisma.undanganGift.findMany({
      where: { undanganId: id },
      include: { bank: true },
      orderBy: { createdAt: 'asc' },
    })

    return ok(gifts.map(resolveGiftBankIcon), 'Get gifts success')
  } catch {
    return serverError()
  }
}

// POST /api/undangan/:id/gifts — add a bank account entry
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
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

    const gift = await prisma.undanganGift.create({
      data: {
        id: nanoid(),
        undanganId: id,
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

    return created(resolveGiftBankIcon(gift), 'Gift added successfully')
  } catch {
    return serverError()
  }
}
