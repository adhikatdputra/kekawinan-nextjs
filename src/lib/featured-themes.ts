import type { Prisma } from '@prisma/client'
import { FEATURED_THEME_LIMIT } from '@/lib/queries/themes-public'

// Only themes users can see count toward the limit. A starred theme that is
// inactive or admin-only keeps its star but doesn't take a slot.
const VISIBLE_FEATURED = { isFeatured: true, isActive: true, isShowAdmin: false }

/**
 * Unstars the visible featured themes beyond FEATURED_THEME_LIMIT, oldest star
 * first. Call inside the same transaction as the change that may have added a
 * featured theme. Returns the names of the themes that lost their star.
 */
export async function enforceFeaturedLimit(tx: Prisma.TransactionClient) {
  const overflow = await tx.theme.findMany({
    where: VISIBLE_FEATURED,
    orderBy: { featuredAt: { sort: 'desc', nulls: 'last' } },
    skip: FEATURED_THEME_LIMIT,
    select: { id: true, name: true },
  })
  if (overflow.length === 0) return []

  await tx.theme.updateMany({
    where: { id: { in: overflow.map((t) => t.id) } },
    data: { isFeatured: false, featuredAt: null },
  })
  return overflow.map((t) => t.name ?? t.id)
}
