import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/tamu/[id]/status — Public (untuk polling di halaman tamu hari H)
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params

  try {
    const tamu = await prisma.tamu.findUnique({
      where: { id },
      select: { isConfirm: true, attendedAt: true, name: true, maxInvite: true },
    })
    if (!tamu) return notFound('Tamu tidak ditemukan')

    return ok(tamu, 'Get tamu status success')
  } catch {
    return serverError()
  }
}
