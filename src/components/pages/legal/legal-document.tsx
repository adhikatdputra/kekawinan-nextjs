import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export default function LegalDocument({
  title,
  updatedAt,
  intro,
  sections,
  related,
}: {
  title: string;
  updatedAt: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  related: { label: string; href: string };
}) {
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
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Terakhir diperbarui {updatedAt}
            </p>
            <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-3">
              {intro}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* Daftar isi: sticky di desktop, blok biasa di mobile */}
          <nav aria-label="Daftar isi" className="mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Daftar isi
              </p>
              <ol className="space-y-2 text-sm border-l border-gray-200">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block -ml-px border-l border-transparent pl-4 py-0.5 text-gray-600 hover:text-green-kwn hover:border-green-kwn focus-visible:text-green-kwn focus-visible:border-green-kwn outline-none transition-colors"
                    >
                      {i + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-3xl">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 pb-10 mb-10 border-b border-gray-100 last:border-b-0 last:mb-0"
              >
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  <span className="text-green-kwn mr-2">{i + 1}.</span>
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-green-kwn [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-gray-900">
                  {section.body}
                </div>
              </section>
            ))}

            <p className="mt-12 text-sm text-gray-500">
              Baca juga:{" "}
              <Link
                href={related.href}
                className="text-green-kwn underline underline-offset-2"
              >
                {related.label}
              </Link>
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
