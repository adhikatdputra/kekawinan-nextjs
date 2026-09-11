import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ kadoId: string }> }

// GET /api/kado/public/item/:kadoId — public kado detail for guest confirmation page
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { kadoId } = await params

    const kado = await prisma.kado.findUnique({
      where: { id: kadoId },
      include: {
        undangan: {
          select: {
            status: true,
            gifts: {
              where: {
                OR: [
                  { nameAddress: { not: null } },
                  { phone: { not: null } },
                  { address: { not: null } },
                ],
              },
              select: {
                nameAddress: true,
                phone: true,
                address: true,
              },
              orderBy: { createdAt: 'asc' },
              take: 1,
            },
          },
        },
      },
    })
    if (!kado) return notFound('Kado not found')
    if (kado.undangan.status !== 'ACTIVE') return notFound('Kado not found')

    const { undangan, ...kadoData } = kado
    const recipientAddress = undangan.gifts[0] ?? null

    return ok(
      {
        ...kadoData,
        thumbnail: resolveMediaUrl(kado.thumbnail),
        recipientAddress,
      },
      'Get kado success',
    )
  } catch {
    return serverError()
  }
}
