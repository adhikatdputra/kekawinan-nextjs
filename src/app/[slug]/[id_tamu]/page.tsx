import type { Metadata, ResolvingMetadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { UndanganView } from "@/components/pages/undangan/view";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";

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
  const { slug } = await params;
  const data = await fetchUndanganBySlug(slug);
  const previousImages = (await parent).openGraph?.images || [];
  const title = `Kekawinan ${data?.data?.content?.title ?? ""}`.trim();
  return {
    title,
    description: `Undangan Pernikahan dari ${data?.data?.content?.title ?? ""}`,
    openGraph: {
      title,
      description: `Undangan Pernikahan dari ${data?.data?.content?.title ?? ""}`,
      images: [
        ...(data?.data?.content?.imgThumbnail ? [data.data.content.imgThumbnail] : []),
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
