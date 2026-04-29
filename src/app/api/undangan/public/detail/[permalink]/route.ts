import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ permalink: string }> }

// GET /api/undangan/public/detail/:permalink — lightweight, theme info only
// Used to determine which theme component to render
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { permalink } = await params

    const data = await prisma.undangan.findUnique({
      where: { permalink },
      include: { theme: true },
    })

    if (!data || data.status !== 'ACTIVE') return notFound('Undangan not found')

    if (data.theme) {
      const t = data.theme as Record<string, unknown>
      t.thumbnail = resolveMediaUrl(t.thumbnail as string)
    }

    return ok(data, 'Get undangan detail success')
  } catch {
    return serverError()
  }
}
