"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/frontend/api/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      setSent(true);
    },
    onError: () => {
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    },
  });

  const handleSubmit = () => {
    if (!emailRegex.test(email)) {
      toast.error("Format email tidak valid");
      return;
    }
    forgotPassword.mutate(email);
  };

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

            {sent ? (
              <div className="flex flex-col gap-4 text-center">
                <h3 className="text-2xl font-bold text-green-kwn">Email Terkirim!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Jika email <strong>{email}</strong> terdaftar, kami telah mengirimkan link reset password.
                  Silahkan cek inbox atau folder spam kamu.
                </p>
                <p className="text-gray-500 text-xs">Link akan kadaluarsa dalam 1 jam.</p>
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 text-green-kwn hover:underline text-sm mt-2"
                >
                  <IconArrowLeft size={16} />
                  Kembali ke halaman login
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold text-green-kwn">Lupa Password</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !forgotPassword.isPending && email && handleSubmit()}
                    className="border-green-kwn h-12 rounded-full px-4 bg-white"
                  />
                  <div className="flex justify-center">
                    <Button
                      className="min-w-[200px] h-11"
                      onClick={handleSubmit}
                      disabled={forgotPassword.isPending || !email}
                    >
                      {forgotPassword.isPending ? (
                        <>
                          <IconLoader2 size={20} className="animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        "Kirim Link Reset"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
