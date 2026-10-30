import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { revalidateUndanganByPermalink } from '@/lib/queries/revalidate-undangan'
import { isUndanganExpired } from '@/lib/undangan-expiry'

/**
 * Check that a permalink can be used for a new or renamed undangan.
 * A slug held by an expired undangan is released (same as the admin
 * "remove expired" action) so another user can take it. Slugs matching a
 * theme's componentName are reserved for theme demos; only admins (who create
 * those demos) may use them.
 */
export async function claimPermalink(
  permalink: string,
  { isAdmin }: { isAdmin: boolean },
): Promise<{ ok: true } | { ok: false }> {
  if (!isAdmin) {
    const reserved = await prisma.theme.findFirst({
      where: { componentName: { equals: permalink, mode: 'insensitive' } },
      select: { id: true },
    })
    if (reserved) return { ok: false }
  }

  const existing = await prisma.undangan.findUnique({
    where: { permalink },
    select: { id: true, expired: true },
  })
  if (!existing) return { ok: true }
  if (!isUndanganExpired(existing.expired)) return { ok: false }

  await prisma.undangan.update({
    where: { id: existing.id },
    data: { status: 'REMOVED', permalink: `removed-${nanoid()}` },
  })
  revalidateUndanganByPermalink(permalink)
  return { ok: true }
}
