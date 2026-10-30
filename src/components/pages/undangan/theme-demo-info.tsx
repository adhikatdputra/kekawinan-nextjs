import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="px-6 py-10 lg:p-0">
      <div className="flex items-center justify-between mb-10">
        <Link href="/" aria-label="Kekawinan, ke beranda">
          <Image
            src="/images/kekawinan-logo.png"
            alt="Kekawinan"
            width={400}
            height={400}
            className="w-[120px] h-auto"
          />
        </Link>
        <Link
          href="/tema"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-kwn transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Semua tema
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">
        Undangan Pernikahan Digital Tema {name}
      </h1>

      {paragraphs.length > 0 && (
        <div className="text-gray-700 leading-relaxed space-y-4 mb-8">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Yang ada di tema ini
      </h2>
      <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-3">
        {SHARED_FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mb-8">
        Semua isi bisa kamu ganti dari dashboard, dan tampilan menyesuaikan
        layar HP tamu.
      </p>

      <Link
        href="/auth/register"
        className="inline-block bg-green-kwn text-white font-semibold text-sm rounded-full px-6 py-3 hover:bg-green-kwn/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-kwn"
      >
        Daftar dan buat undanganmu
      </Link>
    </div>
  );
}
