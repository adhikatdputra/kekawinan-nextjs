"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconLoader2, IconArrowLeft, IconMailCheck } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/frontend/api/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => setSent(true),
    onError: () => { toast.error("Terjadi kesalahan, silahkan coba lagi"); },
  });

  const handleSubmit = () => {
    if (!emailRegex.test(email)) {
      toast.error("Format email tidak valid");
      return;
    }
    forgotPassword.mutate(email);
  };

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
              <pattern id="fp-dots" patternUnits="userSpaceOnUse" width="24" height="24">
                <circle cx="2" cy="2" r="1.5" fill="#16a34a" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fp-dots)" />
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
            {sent ? (
              /* ── Success State ── */
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <IconMailCheck size={32} className="text-green-kwn" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Terkirim!</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Jika email <strong className="text-gray-800">{email}</strong> terdaftar,
                    kami telah mengirimkan link reset password. Silahkan cek inbox atau folder spam kamu.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Link akan kadaluarsa dalam 1 jam.</p>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-green-kwn font-semibold hover:underline mt-2"
                >
                  <IconArrowLeft size={16} />
                  Kembali ke halaman login
                </Link>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-3 py-1 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-kwn" />
                    <span className="text-xs font-semibold text-green-800">Reset Password</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    Lupa <span className="text-green-kwn">Password?</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Masukkan email kamu dan kami akan mengirimkan link untuk membuat password baru.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !forgotPassword.isPending && email && handleSubmit()}
                      className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
                    />
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl text-white bg-green-kwn hover:bg-green-kwn/90 shadow-md shadow-green-200/50 font-semibold text-sm mt-1"
                    onClick={handleSubmit}
                    disabled={forgotPassword.isPending || !email}
                  >
                    {forgotPassword.isPending ? (
                      <span className="flex items-center gap-2">
                        <IconLoader2 size={18} className="animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      "Kirim Link Reset"
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
            )}
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
