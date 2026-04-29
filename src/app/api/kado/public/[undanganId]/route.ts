import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ undanganId: string }> }

function resolveKado(kado: Record<string, unknown>) {
  return { ...kado, thumbnail: resolveMediaUrl(kado.thumbnail as string) }
}

// GET /api/kado/public/:undanganId — public kado list for the invitation page
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { undanganId } = await params

    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { status: true },
    })
    if (!undangan) return notFound('Undangan not found')

    const items = await prisma.kado.findMany({
      where: { undanganId },
      orderBy: { createdAt: 'asc' },
    })

    return ok(
      items.map((k) => resolveKado(k as unknown as Record<string, unknown>)),
      'Get kado success',
    )
  } catch {
    return serverError()
  }
}
