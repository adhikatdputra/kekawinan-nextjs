import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { undanganCacheTag } from '@/lib/queries/undangan-public'

// Invalidate the cached public invitation data so the next visitor sees fresh
// content. Call this from any mutation that changes what a guest sees.
// Next 16 requires a cacheLife profile as the second arg; 'max' is the
// recommended value for on-demand purges (see the revalidateTag deprecation note).
export function revalidateUndanganByPermalink(permalink: string) {
  revalidateTag(undanganCacheTag(permalink), 'max')
}

// Same, but for mutations that only know the invitation id (most CMS endpoints).
// Looks up the permalink (one cheap query, only on writes) then revalidates.
export async function revalidateUndanganById(undanganId: string) {
  try {
    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { permalink: true },
    })
    if (undangan?.permalink) revalidateUndanganByPermalink(undangan.permalink)
  } catch {
    // Revalidation is best-effort — never fail the mutation because of it.
  }
}
