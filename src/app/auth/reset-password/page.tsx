"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { IconLoader2, IconEye, IconEyeOff, IconArrowLeft } from "@tabler/icons-react";
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
    if (!token) {
      toast.error("Token reset password tidak valid");
    }
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
    if (!token) {
      toast.error("Token reset password tidak valid");
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.error("Password harus min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    resetPassword.mutate({ token, new_password: newPassword });
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h3 className="text-2xl font-bold text-red-500">Link Tidak Valid</h3>
        <p className="text-gray-500 text-sm">
          Link reset password tidak valid atau sudah kadaluarsa.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-green-kwn hover:underline text-sm"
        >
          Minta link baru
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h3 className="text-2xl font-bold text-green-kwn">Password Berhasil Diubah!</h3>
        <p className="text-gray-600 text-sm">
          Password kamu telah berhasil diubah. Kamu akan diarahkan ke halaman login.
        </p>
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-green-kwn hover:underline text-sm mt-2"
        >
          <IconArrowLeft size={16} />
          Ke halaman login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold text-green-kwn">Reset Password</h3>
        <p className="text-gray-500 text-sm mt-1">
          Buat password baru untuk akun kamu.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-green-kwn h-12 rounded-full px-4 bg-white"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              {showNewPassword ? (
                <IconEyeOff size={20} onClick={() => setShowNewPassword(false)} className="cursor-pointer" />
              ) : (
                <IconEye size={20} onClick={() => setShowNewPassword(true)} className="cursor-pointer" />
              )}
            </div>
          </div>
          {newPassword && !PASSWORD_REGEX.test(newPassword) && (
            <p className="text-xs text-red-500 px-2">
              Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol (@$!%*?&)
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-green-kwn h-12 rounded-full px-4 bg-white"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              {showConfirmPassword ? (
                <IconEyeOff size={20} onClick={() => setShowConfirmPassword(false)} className="cursor-pointer" />
              ) : (
                <IconEye size={20} onClick={() => setShowConfirmPassword(true)} className="cursor-pointer" />
              )}
            </div>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 px-2">Password tidak cocok</p>
          )}
        </div>
        <div className="flex justify-center">
          <Button
            className="min-w-[200px] h-11"
            onClick={handleSubmit}
            disabled={
              resetPassword.isPending ||
              !newPassword ||
              !confirmPassword ||
              !PASSWORD_REGEX.test(newPassword) ||
              newPassword !== confirmPassword
            }
          >
            {resetPassword.isPending ? (
              <>
                <IconLoader2 size={20} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Ubah Password"
            )}
          </Button>
        </div>
      </div>
      <div className="text-center">
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-green-kwn hover:underline text-sm"
        >
          <IconArrowLeft size={16} />
          Kembali ke halaman login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/2 p-0 hidden md:block">
          <div className="relative">
            <Image
              src="/images/bg-login.png"
              alt=""
              width={500}
              height={500}
              className="w-full h-screen object-cover"
            />
            <div className="absolute top-[30%] right-[30px] text-[#9b9b9b] text-right w-full md:w-1/2">
              &quot;Tak perlu mencari keindahan kisah cinta dalam dongeng
              Cinderella, karena bagiku kisah cinta kita bahkan lebih
              indah.&quot;
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center h-screen bg-green-soft-kwn md:bg-transparent">
          <div className="p-6 md:p-16 flex flex-col gap-6 max-w-[500px] mx-auto w-full">
            <div className="text-center mb-6">
              <Image
                src="/images/kekawinan-logo.png"
                alt=""
                width={800}
                height={800}
                className="w-[240px] mx-auto"
              />
            </div>
            <Suspense fallback={<div className="text-center text-gray-500 text-sm">Memuat...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
