import type { Metadata, ResolvingMetadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { UndanganView } from "@/components/pages/undangan/view";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";
import { getThemeMeta } from "@/frontend/constants/themes-meta";

type Props = {
  params: Promise<{
    slug: string;
    id_tamu: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, id_tamu } = await params;

  // Demo page: return theme-specific SEO metadata
  if (id_tamu === "demo") {
    const themeMeta = getThemeMeta(slug);
    if (themeMeta) {
      return {
        title: themeMeta.title,
        description: themeMeta.description,
        keywords: [...themeMeta.keywords],
        alternates: {
          canonical: `https://www.kekawinan.com/${slug}/demo`,
        },
        openGraph: {
          title: themeMeta.title,
          description: themeMeta.description,
          url: `https://www.kekawinan.com/${slug}/demo`,
          images: [
            {
              url: `https://www.kekawinan.com/images/og-image.png`,
              width: 1200,
              height: 630,
            },
          ],
        },
      };
    }
  }

  // Real invitation page: fetch from API
  const data = await fetchUndanganBySlug(slug);
  const previousImages = (await parent).openGraph?.images || [];
  const title = `Kekawinan ${data?.data?.content?.title ?? ""}`.trim();
  return {
    title,
    description: `Undangan Pernikahan dari ${data?.data?.content?.title ?? ""}`,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: `Undangan Pernikahan dari ${data?.data?.content?.title ?? ""}`,
      images: [
        ...(data?.data?.content?.imgThumbnail
          ? [data.data.content.imgThumbnail]
          : []),
        ...previousImages,
      ],
    },
  };
}

export default async function UndanganPage({ params }: Props) {
  const { slug, id_tamu } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => fetchUndanganBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UndanganView slug={slug} id_tamu={id_tamu} />
    </HydrationBoundary>
  );
}
