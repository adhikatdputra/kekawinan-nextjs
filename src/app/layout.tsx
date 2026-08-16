import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/lib/tanstack";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { home } from "@/frontend/constants/meta";
const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  alternates: home.alternates,
  publisher: "CTRL Spark",
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "undangan pernikahan digital",
    "undangan online",
    "website undangan nikah",
    "template undangan pernikahan",
    "undangan digital gratis",
    "buat undangan pernikahan",
    "kado pernikahan digital",
    "kekawinan",
    "undangan gratis",
    "undangan digital aesthetic",
  ],
  openGraph: {
    title: home.title,
    description: home.description,
    url: "https://www.kekawinan.com",
    siteName: "Kekawinan",
    images: [
      {
        url: "https://www.kekawinan.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kekawinan - Buat Undangan Pernikahan Digital Gratis & Mudah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: home.title,
    description: home.description,
    images: ["https://www.kekawinan.com/images/og-image.png"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PLMJCNCM";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-L2V3T9RFZJ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <GoogleTagManager gtmId={GTM_ID} />
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      
      <body className="antialiased">
        <ReactQueryProvider>
          {children}
          <Toaster />
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
