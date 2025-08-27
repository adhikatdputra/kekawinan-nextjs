// app/[slug]/page.tsx
import { redirect } from "next/navigation";

export default async function SlugIndex(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  redirect(`/${slug}/demo`);
}
