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

function UserDropdown({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();

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
        className="flex items-center gap-2 rounded-full border border-green-kwn/30 bg-white px-3 py-1.5 hover:bg-green-soft-kwn transition-colors"
      >
        <UserAvatar name={name} />
        <span className="hidden md:block text-sm font-semibold text-gray-800 max-w-[120px] truncate">
          {name}
        </span>
        <div className="hidden md:flex items-center gap-1 bg-green-soft-kwn rounded-full px-2 py-0.5">
          <IconCoin size={13} className="text-green-kwn" />
          <span className="text-xs font-bold text-green-kwn">{balance}</span>
        </div>
        <IconChevronDown
          size={14}
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          {/* Credit badge inside dropdown for mobile */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 md:hidden">
            <IconCoin size={14} className="text-green-kwn" />
            <span className="text-xs text-gray-500">Credit</span>
            <span className="ml-auto text-sm font-bold text-green-kwn">{balance}</span>
          </div>

          <Link
            href="/user/undangan-list"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-soft-kwn hover:text-green-kwn transition-colors"
          >
            <IconLayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/user/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-soft-kwn hover:text-green-kwn transition-colors"
          >
            <IconUser size={16} />
            Profile
          </Link>
          <Link
            href="/user/credit"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-soft-kwn hover:text-green-kwn transition-colors"
          >
            <IconCreditCard size={16} />
            Credit
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
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
  const { isAuthenticated, getUserName } = useAuth();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const username = getUserName() ?? "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-xl bg-blur header">
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
          <div className="flex items-center gap-4">
            {isLoaded && (
              isAuthenticated() ? (
                <>
                  {/* Desktop: only show UserDropdown */}
                  <div className="hidden md:flex items-center gap-4">
                    
                    <UserDropdown name={username} onLogout={logout} />
                  </div>

                  {/* Mobile: hamburger */}
                  <div className="md:hidden flex items-center gap-3">
                    <UserDropdown name={username} onLogout={logout} />
                  </div>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button className="text-white">
                    <IconLogin2 size={20} />
                    Daftar Sekarang
                  </Button>
                </Link>
              )
            )}

            {/* Mobile menu for unauthenticated */}
            {isLoaded && !isAuthenticated() && (
              <Button
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden"
              >
                {isOpen ? <IconX size={20} /> : <IconMenu4 size={20} />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu for unauthenticated */}
      {isLoaded && !isAuthenticated() && isOpen && (
        <div className="md:hidden bg-white shadow-xl py-3 px-4 flex flex-col gap-2">
          <Link href="/auth/login">
            <Button className="text-white w-full">
              <IconLogin2 size={20} />
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
