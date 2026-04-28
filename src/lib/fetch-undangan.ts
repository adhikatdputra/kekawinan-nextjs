import { getPublicUndanganBySlug } from '@/lib/queries/undangan-public'

// Server-only. Called in Server Components (prefetchQuery + generateMetadata).
// Returns the same { success, data, message } shape as the API route so
// TanStack Query hydration is compatible with the client-side axios fetcher
// that uses select: (data) => data.data
export async function fetchUndanganBySlug(slug: string) {
  try {
    return await getPublicUndanganBySlug(slug)
  } catch {
    return null
  }
}
