import type { Metadata, ResolvingMetadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import undanganUserApi from "@/frontend/api/undangan-user";
import { UndanganView } from "@/components/pages/undangan/view";

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

  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
  });
  // Ambil metadata sebelumnya dari parent
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `Kekawinan ${data?.data?.undangan_content?.title ?? ""}`.trim(),
    description: `Undangan Pernikahan dari ${
      data?.data?.undangan_content?.title ?? ""
    }`,
    openGraph: {
      title: `Kekawinan ${data?.data?.undangan_content?.title ?? ""}`.trim(),
      description: `Undangan Pernikahan dari ${
        data?.data?.undangan_content?.title ?? ""
      }`,
      images: [
        data?.data?.undangan_content?.img_thumbnail ?? "",
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
    queryFn: () => undanganUserApi.getUndangan(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UndanganView slug={slug} id_tamu={id_tamu} />
    </HydrationBoundary>
  );
}
