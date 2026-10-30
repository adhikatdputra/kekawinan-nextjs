import Image from "next/image";
import Link from "next/link";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import {
  WHATSAPP_CUSTOM_DESIGN_URL,
  WHATSAPP_NUMBER_DISPLAY,
  WHATSAPP_URL,
} from "@/frontend/constants/contact";

// Grouped by what visitors come for: picking a theme, or checking who we are
const linkGroups = [
  {
    title: "Jelajahi",
    links: [
      { label: "Pilihan tema", href: "/tema" },
      { label: "Fitur", href: "/#fitur" },
      { label: "Cerita pengguna", href: "/#testimoni" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Kekawinan",
    links: [
      { label: "Tentang kami", href: "/about" },
      { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
      { label: "Syarat & ketentuan", href: "/syarat-ketentuan" },
    ],
  },
];

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow";

export default function FooterWeb() {
  return (
    <footer className="relative bg-brand-ink text-brand-cream">
      {/* The courier walks in carrying an invitation: the brand's "delivery" moment */}
      <BrandCharacter
        character="courier"
        className="absolute -top-14 right-6 w-24 sm:right-[8%] sm:-top-20 sm:w-36"
      />

      <div className="container pt-14 pb-8 sm:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 max-w-sm md:col-span-1">
            <Link href="/" className={`inline-block rounded-md ${focusRing}`}>
              {/* The logo is green-on-transparent; render it in cream on the dark footer */}
              <Image
                src="/images/kekawinan-logo.png"
                alt="Kekawinan, kembali ke beranda"
                width={400}
                height={400}
                className="h-auto w-[150px] brightness-0 invert"
              />
            </Link>
            <p className="mt-5 font-recoleta-alt text-2xl leading-snug font-bold">
              Undangan pernikahan digital, gratis selamanya.
            </p>
            <p className="mt-3 text-sm leading-[1.8] text-brand-cream/75">
              Pilih tema, isi cerita kalian, lalu bagikan ke orang-orang tersayang lewat WhatsApp.
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-bold text-brand-yellow">{group.title}</h2>
              <ul className="mt-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`inline-flex min-h-10 items-center text-[15px] text-brand-cream/85 underline-offset-4 transition-colors hover:text-brand-cream hover:underline ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl bg-white/[0.06] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-6">
          <div>
            <p className="font-bold">Butuh bantuan atau mau desain khusus?</p>
            <p className="mt-1 text-sm text-brand-cream/75">
              Kirim pesan WhatsApp ke {WHATSAPP_NUMBER_DISPLAY}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center rounded-xl bg-brand-yellow px-5 text-[15px] font-bold text-brand-ink transition-colors hover:bg-[#f0cb45] ${focusRing}`}
            >
              Chat WhatsApp
            </a>
            <a
              href={WHATSAPP_CUSTOM_DESIGN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center text-[15px] font-bold underline underline-offset-[6px] ${focusRing}`}
            >
              Diskusi desain custom
            </a>
          </div>
        </div>

        <p className="mt-8 border-t border-brand-cream/15 pt-6 text-[13px] text-brand-cream/65">
          © 2022–{new Date().getFullYear()} Kekawinan.com · Dibuat oleh CTRL Spark
        </p>
      </div>
    </footer>
  );
}
