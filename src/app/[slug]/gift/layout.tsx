import type { Metadata, ResolvingMetadata } from "next";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchUndanganBySlug(slug);
  // Ambil metadata sebelumnya dari parent
  const previousImages = (await parent).openGraph?.images || [];
  const title = `Kado Pernikahan ${data?.data?.content?.title ?? ""}`.trim();
  return {
    title,
    description: `Kado Pernikahan untuk ${data?.data?.content?.title ?? ""}`,
    openGraph: {
      title,
      description: `Kado Pernikahan untuk ${data?.data?.content?.title ?? ""}`,
      images: [
        ...(data?.data?.content?.imgThumbnail ? [data.data.content.imgThumbnail] : []),
        ...previousImages,
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
