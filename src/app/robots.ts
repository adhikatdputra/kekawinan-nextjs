// app/robots.ts
import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        // /auth/ is not blocked: its pages carry a noindex meta tag, and Google
        // can only see that tag if it may crawl the page. Blocking it here kept
        // /auth/login in search results.
        disallow: ["/user/", "/admin/"],
      },
    ],
    sitemap: "https://www.kekawinan.com/sitemap.xml",
  };
}
