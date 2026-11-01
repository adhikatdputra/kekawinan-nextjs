import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

// Fitur ini ada di semua tema, jadi ditulis sekali di sini dan bukan di
// deskripsi per tema (menghindari teks duplikat di 16 halaman demo).
const SHARED_FEATURES = [
  "Cover dengan nama tamu",
  "Profil kedua mempelai",
  "Detail akad dan resepsi dengan Google Maps dan link live streaming",
  "Hitung mundur ke hari acara",
  "Love story dan galeri foto",
  "RSVP dan ucapan dari tamu",
  "Musik latar",
  "Amplop digital dan wishlist kado",
];

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

export default function ThemeDemoInfo({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) {
  const paragraphs = (description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="px-6 py-10 text-brand-ink lg:p-0">
      <div className="mb-10 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Kekawinan, ke beranda" className={`rounded-md ${focusRing}`}>
          <Image
            src="/images/kekawinan-logo.png"
            alt="Kekawinan"
            width={400}
            height={400}
            className="h-auto w-[140px]"
          />
        </Link>
        <Link
          href="/tema"
          className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-green underline underline-offset-4 ${focusRing}`}
        >
          <IconArrowLeft size={16} aria-hidden="true" />
          Semua tema
        </Link>
      </div>

      <h1 className="font-recoleta-alt text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-bold tracking-[-0.025em]">
        <span className="mb-2 block font-sans text-base font-bold tracking-normal text-brand-muted">
          Undangan Pernikahan Digital
        </span>
        Tema <span className="text-brand-leaf">{name}</span>
      </h1>

      {paragraphs.length > 0 && (
        <div className="mt-6 space-y-4 leading-[1.8] text-brand-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <section aria-labelledby="fitur-tema" className="mt-8 rounded-2xl bg-brand-mint p-5 sm:p-6">
        <h2 id="fitur-tema" className="font-bold">
          Yang ada di tema ini
        </h2>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-[15px] sm:grid-cols-2">
          {SHARED_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <IconCheck size={18} className="mt-0.5 shrink-0 text-brand-green" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-brand-pink p-5">
        <BrandCharacter character="host" className="w-16 shrink-0" />
        <p className="text-sm leading-relaxed">
          Semua isi bisa kamu ganti dari dashboard, dan tampilannya menyesuaikan
          layar HP tamu.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/auth/register"
          className={`inline-flex min-h-[52px] items-center rounded-xl bg-brand-green px-6 font-bold text-white transition-colors hover:bg-brand-green-dark ${focusRing}`}
        >
          Daftar dan buat undanganmu
        </Link>
        <Link
          href="/tema"
          className={`inline-flex min-h-11 items-center font-bold text-brand-green underline underline-offset-4 ${focusRing}`}
        >
          Lihat tema lain
        </Link>
      </div>
    </div>
  );
}
