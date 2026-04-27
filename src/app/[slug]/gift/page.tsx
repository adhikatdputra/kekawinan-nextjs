import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GiftView } from "@/components/pages/gift/view";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function UndanganPage({ params }: Props) {
  const { slug } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => fetchUndanganBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GiftView slug={slug} />
    </HydrationBoundary>
  );
}
