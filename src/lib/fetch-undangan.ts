import { cache } from 'react'
import { getPublicUndanganBySlug } from '@/lib/queries/undangan-public'

// Server-only. Called in Server Components (prefetchQuery + generateMetadata).
// Wrapped in React.cache so generateMetadata and the page component share a
// single call within the same request instead of resolving the data twice.
// Returns the same { success, data, message } shape as the API route so
// TanStack Query hydration is compatible with the client-side axios fetcher
// that uses select: (data) => data.data
export const fetchUndanganBySlug = cache(async (slug: string) => {
  try {
    return await getPublicUndanganBySlug(slug)
  } catch {
    return null
  }
})
