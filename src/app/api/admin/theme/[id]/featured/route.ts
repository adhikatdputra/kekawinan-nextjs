import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { enforceFeaturedLimit } from '@/lib/featured-themes'
import { revalidateTheme } from '@/lib/queries/revalidate-theme'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/admin/theme/:id/featured — body { isFeatured: boolean }
// Starring past the limit unstars the theme starred longest ago; their names
// come back in `unfeatured` so the admin page can say which one lost its star.
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const body = await request.json()
    if (typeof body?.isFeatured !== 'boolean') return badRequest('isFeatured must be a boolean')

    const theme = await prisma.theme.findUnique({
      where: { id },
      select: { id: true, componentName: true },
    })
    if (!theme) return notFound('Theme not found')

    const unfeatured = await prisma.$transaction(async (tx) => {
      await tx.theme.update({
        where: { id },
        data: body.isFeatured
          ? { isFeatured: true, featuredAt: new Date() }
          : { isFeatured: false, featuredAt: null },
        select: { id: true },
      })
      return body.isFeatured ? enforceFeaturedLimit(tx) : []
    })

    // One tag covers every public theme list, so the unstarred ones refresh too
    revalidateTheme(theme.componentName)

    return ok({ id, isFeatured: body.isFeatured, unfeatured }, 'Update featured success')
  } catch {
    return serverError()
  }
}
