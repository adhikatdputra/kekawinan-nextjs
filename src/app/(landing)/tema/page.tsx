import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/frontend/constants/meta";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublicThemes } from "@/lib/queries/themes-public";

export const metadata: Metadata = {
  title: "Tema Undangan Pernikahan Digital | Kekawinan",
  description:
    "Daftar semua tema undangan pernikahan digital di Kekawinan, lengkap dengan warna, ornamen, dan demo yang bisa kamu buka langsung.",
  alternates: {
    canonical: "https://www.kekawinan.com/tema",
  },
  openGraph: {
    title: "Tema Undangan Pernikahan Digital | Kekawinan",
    description:
      "Daftar semua tema undangan pernikahan digital di Kekawinan, lengkap dengan demo yang bisa kamu buka langsung.",
    url: "https://www.kekawinan.com/tema",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function TemaPage() {
  const themes = await getPublicThemes();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-green-soft-kwn/40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-10 md:pt-14 md:pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-kwn transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tema Undangan Pernikahan Digital
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Ada {themes.length} tema yang bisa kamu pakai. Fiturnya sama di
              semua tema, yang berbeda hanya tampilannya. Buka demonya untuk
              melihat undangan persis seperti yang diterima tamu.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {themes.length === 0 ? (
          <p className="text-gray-600">
            Daftar tema sedang tidak bisa dimuat. Coba muat ulang halaman ini
            beberapa saat lagi.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {themes.map((theme) => (
              <li key={theme.id}>
                <Link
                  href={`/${theme.slug}/demo`}
                  className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green-kwn focus-visible:ring-offset-4"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {theme.thumbnail && (
                      <Image
                        src={theme.thumbnail}
                        alt={`Tampilan tema undangan ${theme.name ?? theme.componentName}`}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-kwn transition-colors">
                      {theme.name ?? theme.componentName}
                    </h2>
                    {theme.isFree && (
                      <span className="shrink-0 text-xs font-semibold text-green-800 bg-green-soft-kwn border border-green-200 px-2 py-0.5 rounded-full">
                        Gratis
                      </span>
                    )}
                  </div>
                  {theme.metaDescription && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {/* The meta text ends with a "Lihat demonya" CTA; the card already has one */}
                      {theme.metaDescription.replace(/\s*Lihat demonya.*$/, "")}
                    </p>
                  )}
                  <span className="text-sm font-semibold text-green-kwn">
                    Lihat demo
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
