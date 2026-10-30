import { revalidateTag } from 'next/cache'
import { THEMES_CACHE_TAG } from '@/lib/queries/themes-public'
import { revalidateUndanganByPermalink } from '@/lib/queries/revalidate-undangan'

// The demo page for a theme is the undangan whose permalink is the lowercased
// componentName (Theme1 → /theme1/demo), so its cache entry is purged too.
export function revalidateTheme(componentName: string | null | undefined) {
  try {
    revalidateTag(THEMES_CACHE_TAG, 'max')
    if (componentName) revalidateUndanganByPermalink(componentName.toLowerCase())
  } catch {
    // Revalidation is best-effort: never fail the mutation because of it.
  }
}

const META_DESCRIPTION_MAX = 255

type ThemeSeoData = {
  description?: string | null
  metaDescription?: string | null
  keywords?: string[]
}

// Picks the SEO fields out of an admin request body. Only keys present in the
// body are returned, so PUT stays a partial update. keywords accepts an array
// or a comma-separated string.
export function parseThemeSeoFields(
  body: Record<string, unknown>,
): { data: ThemeSeoData } | { error: string } {
  const data: ThemeSeoData = {}

  if ('description' in body) {
    const value = typeof body.description === 'string' ? body.description.trim() : ''
    data.description = value || null
  }

  if ('metaDescription' in body) {
    const value = typeof body.metaDescription === 'string' ? body.metaDescription.trim() : ''
    if (value.length > META_DESCRIPTION_MAX) {
      return { error: `metaDescription maksimal ${META_DESCRIPTION_MAX} karakter` }
    }
    data.metaDescription = value || null
  }

  if ('keywords' in body) {
    const raw = body.keywords
    const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : []
    data.keywords = list
      .filter((k): k is string => typeof k === 'string')
      .map((k) => k.trim())
      .filter(Boolean)
  }

  return { data }
}
