import { MetadataRoute } from "next";
const baseUrl = "https://www.kekawinan.com/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: "/", priority: 1.0 },
    { path: "/auth/login", priority: 1.0 },
    { path: "/auth/register", priority: 1.0 },
    { path: "/theme1/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme2/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme3/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme4/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme5/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme6/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme7/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme8/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme9/demo", priority: 0.8, changeFrequency: "monthly" },
  ].map(({ path, priority, changeFrequency = "weekly" }) => ({
    url: `${baseUrl}${path}`,
    lastModified: "2025-08-28T07:36:12.961Z",
    changeFrequency: changeFrequency as
      | "monthly"
      | "weekly"
      | "daily"
      | "yearly"
      | "always"
      | "hourly"
      | "never",
    priority,
  }));

  return [...staticPages];
}
