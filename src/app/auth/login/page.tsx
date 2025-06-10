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
            <h3 className="text-2xl font-bold text-green-kwn">Login</h3>
            <div className="flex flex-col gap-6">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
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
              <div className="flex justify-center">
                <Button
                  className="min-w-[200px] h-11"
                  onClick={() => login.mutate({ email, password })}
                  disabled={login.isPending || !email || !password}
                >
                  {login.isPending ? (
                    <>
                      <IconLoader2 size={20} className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Masuk ke Kawinan"
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p>
                Kamu belum punya akun?{" "}
                <Link href="/auth/register" className="text-green-kwn">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
