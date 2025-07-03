"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/frontend/api/auth";
import toast from "react-hot-toast";
import { IconLoader2 } from "@tabler/icons-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Berhasil mendaftar");
        router.push("/auth/login");
      } else {
        toast.error(response.message);
      }
    },
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const whatsappRegex = /^\+?\d{9,}$/;

  const changeNoPhone = (phone: string) => {
    if (phone.startsWith("0")) {
      return phone.replace("0", "+62");
    }
    if (phone.startsWith("62")) {
      return phone.replace("62", "+62");
    }
    if (phone.startsWith("+620")) {
      return phone.replace("+620", "+62");
    }
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('/images//bg-regist.png')] bg-cover bg-center p-4 gap-8">
      <Image
        src="/images/kekawinan-logo.png"
        alt="logo"
        width={500}
        height={500}
        className="w-[250px]"
      />
      <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col gap-8">
        <div className="text-center">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-green-kwn">
            Login sekarang
          </Link>
        </div>
        <div className="w-full md:min-w-[400px] mx-auto">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <Input
                type="text"
                placeholder="Nama Lengkap"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="whatsapp">Nomor Whatsapp</Label>
              <Input
                type="number"
                placeholder="Nomor Whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-green-kwn h-12 rounded-full px-4 bg-white"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4">
                  {showPassword ? (
                    <IconEyeOff
                      size={20}
                      onClick={() => setShowPassword(false)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <IconEye
                      size={20}
                      onClick={() => setShowPassword(true)}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="text-base"
            disabled={
              !fullname ||
              !email ||
              !password ||
              !whatsapp ||
              register.isPending
            }
            onClick={handleRegister}
          >
            {register.isPending ? (
              <div className="flex items-center gap-2">
                <IconLoader2 className="animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Daftar Akun"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
