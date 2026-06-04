import { MetadataRoute } from "next";
const baseUrl = "https://www.kekawinan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency?: "monthly" | "weekly" | "daily" | "yearly" | "always" | "hourly" | "never";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/theme1/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme2/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme3/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme4/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme5/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme6/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme7/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme8/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme9/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme10/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme11/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme12/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme13/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme14/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme15/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/theme16/demo", priority: 0.8, changeFrequency: "monthly" },
  ];

  return staticPages.map(({ path, priority, changeFrequency = "weekly" }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
