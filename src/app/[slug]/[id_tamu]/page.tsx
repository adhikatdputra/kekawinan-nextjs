import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { UndanganView } from "@/components/pages/undangan/view";
import { fetchUndanganBySlug } from "@/lib/fetch-undangan";
import ThemeDemoInfo from "@/components/pages/undangan/theme-demo-info";
import ThemeDemoPreview from "@/components/pages/undangan/theme-demo-preview";
import { getThemeDemoContent } from "@/lib/queries/themes-public";

type Props = {
  params: Promise<{
    slug: string;
    id_tamu: string;
  }>;
  searchParams: Promise<{ embed?: string; preview?: string }>;
};

type UndanganResult = Awaited<ReturnType<typeof fetchUndanganBySlug>>;

// A theme's public demo is the undangan whose permalink equals the lowercased
// componentName (Theme1 → /theme1/demo). Users also preview their own
// invitation at /<permalink>/demo, so "demo" alone is not enough.
async function getDemoTheme(slug: string, id_tamu: string, data: UndanganResult) {
  const theme = data?.data?.theme;
  if (id_tamu !== "demo" || !theme?.componentName) return null;
  if (theme.componentName.toLowerCase() !== slug) return null;
  return getThemeDemoContent(theme.componentName);
}

const SITE_OG_IMAGE = {
  url: "https://www.kekawinan.com/images/og-image.png",
  width: 1200,
  height: 630,
};

// Cloudinary crops the photo to 1200x630 JPG around the faces. WhatsApp shows
// a large preview card for this ratio, and the JPG is several times smaller
// than the original upload (WhatsApp drops previews whose image is too heavy).
function toShareImage(url: string | null | undefined) {
  if (!url) return null;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return { url };
  }
  return {
    url: url
      .replace("/upload/", "/upload/c_fill,w_1200,h_630,g_auto,q_auto/")
      // Cloudinary converts by extension; some crawlers also judge the type by it
      .replace(/\.(png|webp|jpe?g|gif|avif)$/i, ".jpg"),
    width: 1200,
    height: 630,
  };
}

function formatWeddingDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id_tamu } = await params;
  const data = await fetchUndanganBySlug(slug);

  const demoTheme = await getDemoTheme(slug, id_tamu, data);
  if (demoTheme) {
    const title = `Template Undangan Pernikahan ${demoTheme.name} | Kekawinan`;
    const description =
      demoTheme.metaDescription ??
      `Contoh undangan pernikahan digital tema ${demoTheme.name}. Lihat demonya di Kekawinan.`;
    const url = `https://www.kekawinan.com/${slug}/demo`;
    return {
      title,
      description,
      keywords: demoTheme.keywords,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        images: [
          demoTheme.thumbnail ?? {
            url: "https://www.kekawinan.com/images/og-image.png",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  // Real invitation page: this is what WhatsApp shows when the link is shared
  const content = data?.data?.content;
  const couple =
    content?.title?.trim() ||
    [content?.nameFemale, content?.nameMale].filter(Boolean).join(" & ");
  const title = couple ? `Undangan Pernikahan ${couple}` : "Undangan Pernikahan";
  const date = formatWeddingDate(content?.dateWedding);
  const description = date
    ? `Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari pernikahan kami pada ${date}.`
    : "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari pernikahan kami.";
  const image =
    toShareImage(content?.imgThumbnail) ?? toShareImage(content?.imgBg) ?? SITE_OG_IMAGE;
  const imageWithAlt = { ...image, alt: couple ? `Foto ${couple}` : "Undangan pernikahan" };

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `https://www.kekawinan.com/${slug}/${id_tamu}`,
      siteName: "Kekawinan",
      locale: "id_ID",
      type: "website",
      images: [imageWithAlt],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function UndanganPage({ params, searchParams }: Props) {
  const { slug, id_tamu } = await params;
  const { embed, preview } = await searchParams;

  // Real 404 status for unknown or inactive invitations (was a 200 soft 404)
  const data = await fetchUndanganBySlug(slug);
  if (!data) notFound();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => fetchUndanganBySlug(slug),
  });

  const view = (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ?preview=1 is the editor's side preview: keep it silent */}
      <UndanganView slug={slug} id_tamu={id_tamu} muted={preview === "1"} />
    </HydrationBoundary>
  );

  const demoTheme = await getDemoTheme(slug, id_tamu, data);
  // ?embed=1 is what the desktop phone frame loads: the bare invitation only
  if (!demoTheme || embed === "1") return view;

  const themeName = demoTheme.name ?? slug;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: "https://www.kekawinan.com/" },
      { "@type": "ListItem", position: 2, name: "Tema", item: "https://www.kekawinan.com/tema" },
      { "@type": "ListItem", position: 3, name: themeName, item: `https://www.kekawinan.com/${slug}/demo` },
    ],
  };

  // Desktop: text on the left, phone frame on the right (sticky while the
  // text scrolls). Mobile: invitation first, text below.
  return (
    <div className="bg-brand-cream lg:min-h-screen">
      <script
        type="application/ld+json"
        // Escape "<" so a theme name can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-16 lg:px-8 lg:py-12 max-w-6xl mx-auto">
        <div className="order-2 border-t border-brand-line lg:order-none lg:max-w-[480px] lg:border-t-0 lg:pt-6">
          <ThemeDemoInfo name={themeName} description={demoTheme.description} />
        </div>
        <div className="order-1 lg:order-none lg:shrink-0 lg:sticky lg:top-8">
          <ThemeDemoPreview slug={slug} themeName={themeName}>
            {view}
          </ThemeDemoPreview>
        </div>
      </div>
    </div>
  );
}
