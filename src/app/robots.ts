// app/robots.ts
import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/user/", "/admin/"],
      },
    ],
    sitemap: "https://kekawinan.com/sitemap.xml",
    host: "https://kekawinan.com",
  };
}
