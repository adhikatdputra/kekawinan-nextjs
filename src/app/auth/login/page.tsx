"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/pages/auth/auth-shell";
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

  return <AuthShell variant="login"><form onSubmit={event => { event.preventDefault(); if (!(login.isPending || !email || !password)) login.mutate({ email, password }); }}>
          {/* Header */}
            <div className="mb-8">
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
                <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input id="login-email" autoComplete="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
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
                  <Input id="login-password" autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-1 flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
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
                type="submit"
                disabled={login.isPending || !email || !password}
              >
                {login.isPending ? (
                  <span className="flex items-center gap-2">
                    <IconLoader2 size={18} className="animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Masuk ke Kekawinan"
                )}
              </Button>
            </div>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-green-kwn font-semibold hover:underline"
              >
                Daftar gratis sekarang
              </Link>
            </p>

  </form></AuthShell>;
}
