import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/lib/tanstack";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { home } from "@/frontend/constants/meta";

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  alternates: home.alternates,
  publisher: "Partnerinaja",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico", // pastikan file ini ada di folder /public
    shortcut: "/favicon.ico", // opsional
    apple: "/apple-touch-icon.png", // opsional
  },
  keywords: [
    "undangan pernikahan digital",
    "undangan online",
    "website undangan nikah",
    "template undangan",
    "kado pernikahan",
    "kekawinan",
    "undangan gratis"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <GoogleTagManager gtmId="G-L2V3T9RFZJ" />
      <body className="antialiased">
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
