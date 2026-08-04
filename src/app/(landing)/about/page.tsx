import type { Metadata } from "next";
import AboutPageContent from "@/components/pages/about/about-page-content";

export const metadata: Metadata = {
  title: "Tentang Kami — Undangan Digital Gratis untuk Semua | Kekawinan",
  description:
    "Kenali Kekawinan lebih dekat — platform undangan pernikahan digital gratis untuk pasangan Indonesia. Cerita, nilai, dan misi kami membuat momen bahagia mudah dibagikan.",
  alternates: {
    canonical: "https://www.kekawinan.com/about",
  },
  openGraph: {
    title: "Tentang Kami — Undangan Digital Gratis untuk Semua | Kekawinan",
    description:
      "Cerita di balik Kekawinan — undangan pernikahan digital gratis, indah, dan mudah untuk semua pasangan Indonesia.",
    url: "https://www.kekawinan.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
