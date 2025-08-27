// app/[slug]/page.tsx
import { redirect } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default function SlugIndex({ params }: PageProps) {
  redirect(`/${params.slug}/demo`);
}
