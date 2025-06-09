"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { IconLogin2, IconLogout2, IconMenu4, IconX } from "@tabler/icons-react";
import { useAuth } from "@/frontend/composable/useAuth";
import useAuthStore from "@/frontend/store/auth-store";

export default function HeaderWeb() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full  shadow-xl bg-blur header">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/kekawinan-logo.png"
              alt="Kekawinan"
              width={400}
              height={400}
              className="w-[200px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <div
              className={`items-center gap-6 fixed top-full left-0 right-0 bg-white shadow-xl md:relative md:shadow-none md:bg-transparent md:flex-row w-full md:w-auto justify-center md:justify-start py-2 md:py-0 ${
                isOpen ? "flex" : "hidden md:flex"
              }`}
            >
              {isLoaded &&
                (isAuthenticated() ? (
                  <>
                    <Link href="/user/undangan-list" className="font-semibold">
                      Dashboard
                    </Link>
                    <Link href="/user/profile" className="font-semibold">
                      Profile
                    </Link>
                    <Button className="text-white" onClick={() => logout()}>
                      <IconLogout2 size={20} />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button className="text-white">
                      <IconLogin2 size={20} />
                      Daftar Sekarang
                    </Button>
                  </Link>
                ))}
            </div>
            <Button
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <IconX size={20} /> : <IconMenu4 size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
