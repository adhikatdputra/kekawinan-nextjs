"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import useLogin from "@/frontend/store/auth-store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/frontend/composable/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/user/undangan-list");
    }
  }, [isAuthenticated]);

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
        {/* Green overlay */}
        <div className="absolute inset-0 bg-green-kwn/40 mix-blend-multiply" />
        <div className="absolute top-[30%] right-8 text-white/80 text-right max-w-[45%]">
          &quot;Tak perlu mencari keindahan kisah cinta dalam dongeng
          Cinderella, karena bagiku kisah cinta kita bahkan lebih indah.&quot;
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center relative overflow-hidden min-h-screen">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="form-dots"
                patternUnits="userSpaceOnUse"
                width="24"
                height="24"
              >
                <circle cx="2" cy="2" r="1.5" fill="#16a34a" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#form-dots)" />
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

          {/* Form card */}
          <div className="bg-green-soft-kwn/25 backdrop-blur-md border border-green-soft-kwn rounded-3xl px-8 py-10 shadow-sm">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-kwn" />
                <span className="text-xs font-semibold text-green-800">
                  Selamat datang kembali
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Masuk ke <span className="text-green-kwn">Kekawinan.com</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Lanjutkan membuat undangan pernikahan digitalmu.
              </p>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-green-kwn hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl text-white bg-green-kwn hover:bg-green-kwn/90 shadow-md shadow-green-200/50 font-semibold text-sm mt-2"
                onClick={() => login.mutate({ email, password })}
                disabled={login.isPending || !email || !password}
              >
                {login.isPending ? (
                  <span className="flex items-center gap-2">
                    <IconLoader2 size={18} className="animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Masuk ke Kawinan"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-green-kwn font-semibold hover:underline"
              >
                Daftar gratis sekarang
              </Link>
            </p>
          </div>

          {/* Back to home */}
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
