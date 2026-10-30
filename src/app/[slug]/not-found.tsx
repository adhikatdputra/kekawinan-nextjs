import Link from "next/link";
import NotFound from "@/components/card/not-found";

// Rendered with a real 404 status when the invitation slug doesn't exist
// (see notFound() in page.tsx), instead of a 200 "not found" page.
export default function UndanganNotFound() {
  return (
    <div className="relative">
      <NotFound
        title="Waduh, undanganmu nggak ada!"
        description="Mungkin kamu salah klik link ini, atau undangannya sudah tidak aktif. Cek lagi link dari pengirim undangan."
      />
      <div className="absolute bottom-10 inset-x-0 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-green-kwn underline underline-offset-4"
        >
          Ke beranda Kekawinan
        </Link>
      </div>
    </div>
  );
}
