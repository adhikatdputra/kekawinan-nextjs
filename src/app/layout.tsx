import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/lib/tanstack";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kekawinan | Undangan Pernikahan Digital",
  description:
    "Undangan Pernikahan Digital Gratis, Mudah, dan Berkesan! Buat undangan pernikahan digital yang bisa kamu atur sendiri dari tema, foto prewed, sampai playlist favorit! Gratis, gampang, dan pastinya berkesan!",
  icons: {
    icon: "/favicon.ico", // pastikan file ini ada di folder /public
    shortcut: "/favicon.ico", // opsional
    apple: "/apple-touch-icon.png", // opsional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
