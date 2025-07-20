import type { Metadata, ResolvingMetadata } from "next";
import { QueryClient } from "@tanstack/react-query";
import undanganUserApi from "@/frontend/api/undangan-user";

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

  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
  });
  // Ambil metadata sebelumnya dari parent
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `Kado Pernikahan ${
      data?.data?.undangan_content?.title ?? ""
    }`.trim(),
    description: `Kado Pernikahan untuk ${
      data?.data?.undangan_content?.title ?? ""
    }`,
    openGraph: {
      title: `Kado Pernikahan ${
        data?.data?.undangan_content?.title ?? ""
      }`.trim(),
      description: `Kado Pernikahan untuk ${
        data?.data?.undangan_content?.title ?? ""
      }`,
      images: [
        data?.data?.undangan_content?.img_thumbnail ?? "",
        ...previousImages,
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
