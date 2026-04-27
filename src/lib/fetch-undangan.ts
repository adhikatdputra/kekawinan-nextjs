const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Returns full response body { success, data, message } to match axios response shape
// so React Query hydration works with client-side select: (data) => data.data
export async function fetchUndanganBySlug(slug: string) {
  const res = await fetch(`${baseUrl}/api/undangan/public/${slug}`).catch(() => null);
  if (!res?.ok) return null;
  return await res.json();
}
