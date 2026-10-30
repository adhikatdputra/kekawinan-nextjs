import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'
import { PUBLIC_THEME_SELECT } from '@/lib/queries/undangan-public'
import { isUndanganVisible } from '@/lib/undangan-expiry'

type Params = { params: Promise<{ permalink: string }> }

// GET /api/undangan/public/detail/:permalink — lightweight, theme info only
// Used to determine which theme component to render
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { permalink } = await params

    const data = await prisma.undangan.findUnique({
      where: { permalink },
      include: { theme: { select: PUBLIC_THEME_SELECT } },
    })

    if (!data || !isUndanganVisible(data)) return notFound('Undangan not found')

    if (data.theme) {
      const t = data.theme as Record<string, unknown>
      t.thumbnail = resolveMediaUrl(t.thumbnail as string)
    }

    return ok(data, 'Get undangan detail success')
  } catch {
    return serverError()
  }
}
