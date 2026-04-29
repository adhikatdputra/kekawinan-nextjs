import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import GiftDetailView from "@/components/pages/gift-detail/view/gift-detail-view";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function UndanganPage({ params }: Props) {
  const { slug, id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => fetchUndanganBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GiftDetailView id={id} />
    </HydrationBoundary>
  );
}
