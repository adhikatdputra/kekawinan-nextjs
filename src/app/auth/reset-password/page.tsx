"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { IconLoader2, IconEye, IconEyeOff, IconArrowLeft, IconShieldCheck } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import authApi from "@/frontend/api/auth";
import toast from "react-hot-toast";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) toast.error("Token reset password tidak valid");
  }, [token]);

  const resetPassword = useMutation({
    mutationFn: ({ token, new_password }: { token: string; new_password: string }) =>
      authApi.resetPassword(token, new_password),
    onSuccess: () => {
      setSuccess(true);
      toast.success("Password berhasil diubah!");
      setTimeout(() => router.push("/auth/login"), 2000);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message;
      if (message?.includes("expired")) {
        toast.error("Link reset password sudah kadaluarsa, silahkan minta link baru");
      } else if (message?.includes("Invalid")) {
        toast.error("Link reset password tidak valid");
      } else {
        toast.error("Gagal reset password, silahkan coba lagi");
      }
    },
  });

  const handleSubmit = () => {
    if (!token) { toast.error("Token reset password tidak valid"); return; }
    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error("Password harus min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol");
      return;
    }
    if (newPassword !== confirmPassword) { toast.error("Konfirmasi password tidak cocok"); return; }
    resetPassword.mutate({ token, new_password: newPassword });
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link Tidak Valid</h2>
          <p className="text-sm text-gray-500">Link reset password tidak valid atau sudah kadaluarsa.</p>
        </div>
        <Link href="/auth/forgot-password" className="text-sm text-green-kwn font-semibold hover:underline">
          Minta link baru
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <IconShieldCheck size={32} className="text-green-kwn" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Diubah!</h2>
          <p className="text-sm text-gray-600">
            Password kamu telah berhasil diubah. Kamu akan diarahkan ke halaman login.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-green-kwn font-semibold hover:underline"
        >
          <IconArrowLeft size={16} />
          Ke halaman login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-kwn" />
          <span className="text-xs font-semibold text-green-800">Buat Password Baru</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Reset <span className="text-green-kwn">Password</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Buat password baru yang kuat untuk akun kamu.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password Baru</label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Min. 8 karakter dengan simbol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {newPassword && !PASSWORD_REGEX.test(newPassword) && (
            <p className="text-xs text-red-500 px-1">
              Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol (@$!%*?&)
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 px-1">Password tidak cocok</p>
          )}
        </div>

        <Button
          className="w-full h-12 rounded-xl text-white bg-green-kwn hover:bg-green-kwn/90 shadow-md shadow-green-200/50 font-semibold text-sm mt-1"
          onClick={handleSubmit}
          disabled={
            resetPassword.isPending || !newPassword || !confirmPassword ||
            !PASSWORD_REGEX.test(newPassword) || newPassword !== confirmPassword
          }
        >
          {resetPassword.isPending ? (
            <span className="flex items-center gap-2">
              <IconLoader2 size={18} className="animate-spin" />
              Memproses...
            </span>
          ) : (
            "Ubah Password"
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">atau</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-green-kwn font-semibold hover:underline"
      >
        <IconArrowLeft size={16} />
        Kembali ke halaman login
      </Link>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left: Image Panel ── */}
      <div className="hidden lg:block lg:w-[52%] relative">
        <Image
          src="/images/bg-login.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-green-kwn/40 mix-blend-multiply" />
        <div className="absolute top-[30%] right-8 text-white/80 text-right max-w-[45%]">
          &quot;Tak perlu mencari keindahan kisah cinta dalam dongeng Cinderella,
          karena bagiku kisah cinta kita bahkan lebih indah.&quot;
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center bg-green-soft-kwn relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rp-dots" patternUnits="userSpaceOnUse" width="24" height="24">
                <circle cx="2" cy="2" r="1.5" fill="#16a34a" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rp-dots)" />
          </svg>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[420px] px-6 py-10">
          {/* Logo — mobile only */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Image
                src="/images/kekawinan-logo.png"
                alt="Kekawinan"
                width={400}
                height={400}
                className="w-[180px] h-auto mx-auto"
              />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl px-8 py-10 shadow-sm">
            <Suspense fallback={
              <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
                <IconLoader2 size={18} className="animate-spin" />
                Memuat...
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-green-kwn transition-colors">
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
