"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/pages/auth/auth-shell";
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

  return <AuthShell variant="forgot"><form onSubmit={event => { event.preventDefault(); if (!sent && !forgotPassword.isPending && email) handleSubmit(); }}>
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
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    Lupa <span className="text-green-kwn">Password?</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Masukkan email kamu dan kami akan mengirimkan link untuk membuat password baru.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="forgot-password-email" className="text-sm font-medium text-gray-700">Email</label>
                    <Input id="forgot-password-email" autoComplete="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
                    />
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl text-white bg-green-kwn hover:bg-green-kwn/90 shadow-md shadow-green-200/50 font-semibold text-sm mt-1"
                    type="submit"
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

                <Link
                  href="/auth/login"
                  className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm text-green-kwn font-semibold hover:underline"
                >
                  <IconArrowLeft size={16} />
                  Kembali ke halaman login
                </Link>
              </>
            )}

  </form></AuthShell>;
}
