/** Build paginated response — consistent format across all list endpoints */
export function paginate<T>(
  rows: T[],
  count: number,
  page: number,
  limit: number,
) {
  return {
    current_page: page,
    total_page: Math.ceil(count / limit),
    total_data: count,
    rows,
  }
}

/**
 * Parse pagination query params with safe defaults.
 * Returns { page, limit, search, sortBy, order }
 */
export function parsePagination(
  searchParams: URLSearchParams,
  allowedSortFields: string[],
  defaultSort = 'createdAt',
) {
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const search = searchParams.get('search') ?? ''
  const rawSort = searchParams.get('sortBy') ?? defaultSort
  const sortBy = allowedSortFields.includes(rawSort) ? rawSort : defaultSort
  const rawOrder = (searchParams.get('order') ?? 'DESC').toUpperCase()
  const order: 'asc' | 'desc' = rawOrder === 'ASC' ? 'asc' : 'desc'

  return { page, limit, search, sortBy, order }
}

/**
 * Resolve a stored image/video path to a full Cloudinary URL.
 * If the stored value is already a full URL (http/https), return as-is.
 * Otherwise prepend the Cloudinary base URL from env.
 */
export function resolveMediaUrl(
  path: string | null | undefined,
  type: 'image' | 'video' = 'image',
): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  const base =
    type === 'video'
      ? process.env.CLOUDINARY_VIDEO_URL
      : process.env.CLOUDINARY_IMAGE_URL
  return base ? `${base}/kekawinan${path}` : path
}

/** Validate that a permalink only contains URL-safe characters */
export function isValidPermalink(permalink: string): boolean {
  return /^[a-z0-9-_]+$/i.test(permalink) && permalink.length >= 3 && permalink.length <= 200
}
