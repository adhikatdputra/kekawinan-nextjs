import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
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
      orderBy: { createdAt: 'asc' },
    })

    return ok(gifts, 'Get gifts success')
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
    const { bankName, name, bankNumber, nameAddress, phone, address } = body

    if (!bankName || !name || !bankNumber) {
      return badRequest('bankName, name, and bankNumber are required')
    }

    const gift = await prisma.undanganGift.create({
      data: {
        id: nanoid(),
        undanganId: id,
        bankName: bankName.trim(),
        name: name.trim(),
        bankNumber: String(bankNumber).trim(),
        nameAddress: nameAddress?.trim() ?? null,
        phone: phone?.trim() ?? null,
        address: address?.trim() ?? null,
      },
    })

    return created(gift, 'Gift added successfully')
  } catch {
    return serverError()
  }
}
