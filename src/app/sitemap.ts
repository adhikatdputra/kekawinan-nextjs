import { MetadataRoute } from "next";
import { getPublicThemes } from "@/lib/queries/themes-public";

const baseUrl = "https://www.kekawinan.com";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No lastModified for static pages: we don't track when they change, and a
  // fake "now" on every build tells Google nothing.
  const staticPages: Array<{ path: string; priority: number; changeFrequency: ChangeFrequency }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/tema", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kebijakan-privasi", priority: 0.3, changeFrequency: "yearly" },
    { path: "/syarat-ketentuan", priority: 0.3, changeFrequency: "yearly" },
  ];

  let themes: Awaited<ReturnType<typeof getPublicThemes>> = [];
  try {
    themes = await getPublicThemes();
  } catch {
    // Keep serving the static part of the sitemap if the DB is unreachable
  }

  return [
    ...staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      changeFrequency,
      priority,
    })),
    ...themes.map((theme) => ({
      url: `${baseUrl}/${theme.slug}/demo`,
      lastModified: theme.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
