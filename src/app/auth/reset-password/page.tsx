"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/pages/auth/auth-shell";
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
          <IconShieldCheck size={30} aria-hidden="true" />
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
    <form onSubmit={event => { event.preventDefault(); if (!resetPassword.isPending) handleSubmit(); }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Reset <span className="text-green-kwn">Password</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Buat password baru yang kuat untuk akun kamu.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-password-newPassword" className="text-sm font-medium text-gray-700">Password Baru</label>
          <div className="relative">
            <Input id="reset-password-newPassword" autoComplete="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Min. 8 karakter dengan simbol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
            />
            <button
              type="button"
              aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-1 flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
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
          <label htmlFor="reset-password-confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
          <div className="relative">
            <Input id="reset-password-confirmPassword" autoComplete="new-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-1 flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
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
          type="submit"
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

      <Link
        href="/auth/login"
        className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm text-green-kwn font-semibold hover:underline"
      >
        <IconArrowLeft size={16} />
        Kembali ke halaman login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return <AuthShell variant="reset"><Suspense fallback={<p role="status">Memuat form password baru...</p>}><ResetPasswordForm /></Suspense></AuthShell>;
}
