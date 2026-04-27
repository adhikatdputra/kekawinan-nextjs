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
      include: { undangan: { select: { status: true } } },
    })
    if (!kado) return notFound('Kado not found')
    if (kado.undangan.status !== 'ACTIVE') return notFound('Kado not found')

    return ok(
      { ...kado, thumbnail: resolveMediaUrl(kado.thumbnail) },
      'Get kado success',
    )
  } catch {
    return serverError()
  }
}
