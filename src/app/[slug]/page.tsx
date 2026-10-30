// app/[slug]/page.tsx
import { notFound, permanentRedirect } from "next/navigation";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";

export default async function SlugIndex(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Unknown slug: answer 404 here rather than redirecting to a "not found"
  // page that returns 200 (Google reports that as a soft 404).
  if (!(await fetchUndanganBySlug(slug))) notFound();

  permanentRedirect(`/${slug}/demo`);
}
