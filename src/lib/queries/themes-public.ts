import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { resolveMediaUrl } from '@/lib/helpers'

// Shared with the admin theme endpoints so edits refresh the homepage, /tema,
// and the sitemap.
export const THEMES_CACHE_TAG = 'themes-public'

async function queryPublicThemes() {
  const rows = await prisma.theme.findMany({
    where: { isActive: true, isShowAdmin: false },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      componentName: true,
      thumbnail: true,
      metaDescription: true,
      credit: true,
      promo: true,
      updatedAt: true,
    },
  })

  return rows
    .filter((t) => t.componentName)
    .map((t) => ({
      ...t,
      componentName: t.componentName as string,
      slug: (t.componentName as string).toLowerCase(),
      // Same effective price as POST /api/undangan: promo if set, else credit
      isFree: (t.promo ?? t.credit) === 0,
      thumbnail: resolveMediaUrl(t.thumbnail),
      // unstable_cache stores JSON, so a Date would come back as a string anyway
      updatedAt: t.updatedAt.toISOString(),
    }))
}

export type PublicTheme = Awaited<ReturnType<typeof queryPublicThemes>>[number]

/**
 * Active, user-visible themes for server-rendered pages (homepage, /tema,
 * sitemap). Cached in the Data Cache and purged via THEMES_CACHE_TAG when an
 * admin changes a theme.
 */
export const getPublicThemes = unstable_cache(queryPublicThemes, ['themes-public'], {
  tags: [THEMES_CACHE_TAG],
  revalidate: 3600,
})

async function queryThemeDemoContent(componentName: string) {
  const theme = await prisma.theme.findFirst({
    where: { componentName, isActive: true, isShowAdmin: false },
    select: {
      name: true,
      thumbnail: true,
      description: true,
      metaDescription: true,
      keywords: true,
    },
  })
  if (!theme) return null
  return { ...theme, thumbnail: resolveMediaUrl(theme.thumbnail) }
}

/**
 * Name and SEO text for a theme's demo page (/themeN/demo). Kept out of the
 * invitation payload so guests of real invitations don't download it. Returns
 * null for inactive or admin-only themes. Same cache tag as getPublicThemes.
 */
export const getThemeDemoContent = unstable_cache(queryThemeDemoContent, ['theme-demo-content'], {
  tags: [THEMES_CACHE_TAG],
  revalidate: 3600,
})
