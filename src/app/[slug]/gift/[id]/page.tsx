import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from "@tanstack/react-query";
  import undanganUserApi from "@/frontend/api/undangan-user";
  import GiftDetailView from "@/components/pages/gift-detail/view/gift-detail-view";
  
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
      queryFn: () => undanganUserApi.getUndangan(slug),
    });
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GiftDetailView id={id} />
      </HydrationBoundary>
    );
  }
  