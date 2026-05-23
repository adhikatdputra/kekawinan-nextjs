import Image from "next/image";
import Link from "next/link";

const links = {
  Produk: [
    { label: "Buat Undangan", href: "/auth/login" },
    { label: "Pilih Tema", href: "#themes" },
    { label: "Fitur Lengkap", href: "#features" },
    { label: "Custom Design", href: "https://wa.me/085772193242" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Syarat & Ketentuan", href: "/" },
  ],
  Bantuan: [
    { label: "Hubungi Kami", href: "https://wa.me/085772193242" },
    { label: "Panduan Pengguna", href: "/" },
    { label: "FAQ", href: "/" },
  ],
};

export default function FooterWeb() {
  return (
    <footer className="bg-green-soft-kwn border-t border-green-200/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
          {/* Brand col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/">
              <Image
                src="/images/kekawinan-logo.png"
                alt="Kekawinan"
                width={400}
                height={400}
                className="w-[150px] h-auto"
                priority
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Platform undangan digital pernikahan gratis — mudah dibuat,
              personal, dan langsung bisa dikirim via WhatsApp.
            </p>
            <Link
              href="https://wa.me/085772193242"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-kwn text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-green-kwn/90 transition-colors w-fit shadow-sm"
            >
              <span>💬</span>
              Hubungi via WhatsApp
            </Link>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-700 hover:text-green-kwn transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-green-200/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © 2022 – {new Date().getFullYear()} Kekawinan.com · Dibuat dengan 💕 oleh CTRL Spark
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-kwn" />
            <span className="text-xs text-gray-500">Gratis Selamanya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
