"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  IconLogin2,
  IconLogout2,
  IconMenu4,
  IconX,
  IconUser,
  IconCoin,
  IconChevronDown,
  IconLayoutDashboard,
  IconCreditCard,
  IconShield,
} from "@tabler/icons-react";
import { useAuth } from "@/frontend/composable/useAuth";
import useAuthStore from "@/frontend/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import creditsApi from "@/frontend/api/credits";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-8 h-8 rounded-full bg-green-kwn text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
      {initials || <IconUser size={14} />}
    </div>
  );
}

function UserDropdown({
  name,
  onLogout,
}: {
  name: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isAuthenticated, getUser } = useAuth();
  const userLevel = getUser()?.level;
  const isAdmin = userLevel === "admin" || userLevel === "superadmin";

  const { data: creditData } = useQuery({
    queryKey: ["credits"],
    queryFn: creditsApi.getMyCredits,
    enabled: isAuthenticated(),
    staleTime: 1000 * 60,
  });
  const balance: number = creditData?.data?.data?.balance ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-green-200/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 hover:bg-green-soft-kwn transition-all shadow-sm"
      >
        <UserAvatar name={name} />
        <span className="hidden md:block text-sm font-semibold text-gray-800 max-w-[110px] truncate">
          {name}
        </span>
        <div className="hidden md:flex items-center gap-1 bg-green-soft-kwn rounded-full px-2 py-0.5">
          <IconCoin size={13} className="text-green-kwn" />
          <span className="text-xs font-bold text-green-kwn">{balance}</span>
        </div>
        <IconChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/80 py-2 z-50">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 md:hidden">
            <IconCoin size={14} className="text-green-kwn" />
            <span className="text-xs text-gray-500">Credit</span>
            <span className="ml-auto text-sm font-bold text-green-kwn">{balance}</span>
          </div>
          {[
            { href: "/user/undangan-list", icon: IconLayoutDashboard, label: "Dashboard" },
            { href: "/user/profile", icon: IconUser, label: "Profile" },
            { href: "/user/credit", icon: IconCreditCard, label: "Credit" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-soft-kwn hover:text-green-kwn transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/users"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-700 hover:bg-green-soft-kwn hover:text-green-kwn transition-colors font-medium"
            >
              <IconShield size={16} />
              Admin
            </Link>
          )}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <IconLogout2 size={16} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeaderWeb() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, getUserName } = useAuth();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const username = getUserName() ?? "";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/92 backdrop-blur-md shadow-sm border-b border-green-100/50"
          : "bg-white/75 backdrop-blur-sm"
      }`}
    >
      <div className="container py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/kekawinan-logo.png"
              alt="Kekawinan"
              width={400}
              height={400}
              className="w-[150px] md:w-[170px] h-auto"
              priority
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {isLoaded &&
              (isAuthenticated() ? (
                <UserDropdown name={username} onLogout={logout} />
              ) : (
                <>
                  <Link href="/auth/login" className="hidden md:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-soft-kwn hover:border-green-300"
                    >
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="sm"
                      className="text-white bg-green-kwn hover:bg-green-kwn/90 shadow-sm shadow-green-200/40"
                    >
                      <IconLogin2 size={15} />
                      Daftar Gratis
                    </Button>
                  </Link>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {isOpen ? <IconX size={18} /> : <IconMenu4 size={18} />}
                  </button>
                </>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isLoaded && !isAuthenticated() && isOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-green-100/50 py-4 px-4 flex flex-col gap-2">
          <Link href="/auth/login" onClick={() => setIsOpen(false)}>
            <Button className="text-white w-full bg-green-kwn hover:bg-green-kwn/90">
              <IconLogin2 size={16} />
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
