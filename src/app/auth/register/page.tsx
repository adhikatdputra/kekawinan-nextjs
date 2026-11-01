"use client";

import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/pages/auth/auth-shell";
import GoogleSignInButton from "@/components/pages/auth/google-sign-in-button";
import Link from "next/link";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/frontend/api/auth";
import toast from "react-hot-toast";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Berhasil mendaftar! Silahkan login.");
        router.push("/auth/login");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { code?: number; message?: string } } };
      const code = axiosError?.response?.data?.code;
      if (code === 409) {
        toast.error("Email sudah digunakan, silahkan gunakan email lain atau login");
      } else {
        toast.error("Pendaftaran gagal, silahkan coba lagi");
      }
    },
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const whatsappRegex = /^\+?\d{9,}$/;

  const changeNoPhone = (phone: string) => {
    if (phone.startsWith("0")) return phone.replace("0", "+62");
    if (phone.startsWith("62")) return phone.replace("62", "+62");
    if (phone.startsWith("+620")) return phone.replace("+620", "+62");
    return phone;
  };

  const handleRegister = () => {
    if (!passwordRegex.test(password)) {
      toast.error("Password harus mengandung setidaknya 8 karakter, satu huruf besar, satu huruf kecil, satu angka, dan satu simbol");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email tidak valid");
      return;
    }
    if (!whatsappRegex.test(whatsapp)) {
      toast.error("Nomor Whatsapp tidak valid");
      return;
    }
    register.mutate({
      fullname,
      email,
      password,
      phone: changeNoPhone(whatsapp),
      level: "user",
    });
  };

  return <AuthShell variant="register"><form onSubmit={event => { event.preventDefault(); if (!(register.isPending || !fullname || !email || !password || !whatsapp)) handleRegister(); }}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Buat Akun <span className="text-green-kwn">Kekawinan.com</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-green-kwn font-semibold hover:underline">
                Masuk sekarang
              </Link>
            </p>
          </div>

          <GoogleSignInButton mode="register" />

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-fullname" className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <Input id="register-fullname" autoComplete="name"
                type="text"
                placeholder="Nama lengkap kamu"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-whatsapp" className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
              <Input id="register-whatsapp" autoComplete="tel"
                type="tel" inputMode="tel"
                placeholder="08xxxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-gray-700">Email</label>
              <Input id="register-email" autoComplete="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input id="register-password" autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter dengan simbol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-white/80 focus:border-green-kwn focus:ring-green-kwn/20 px-4 pr-12"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-1 flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {password && !passwordRegex.test(password) && (
                <p className="text-xs text-red-500 px-1">
                  Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol (@$!%*?&)
                </p>
              )}
            </div>

            <Button
              className="w-full h-12 rounded-xl text-white bg-green-kwn hover:bg-green-kwn/90 shadow-md shadow-green-200/50 font-semibold text-sm mt-1"
              disabled={!fullname || !email || !password || !whatsapp || register.isPending}
              type="submit"
            >
              {register.isPending ? (
                <span className="flex items-center gap-2">
                  <IconLoader2 size={18} className="animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Daftar Akun Gratis"
              )}
            </Button>
          </div>

  </form></AuthShell>;
}
