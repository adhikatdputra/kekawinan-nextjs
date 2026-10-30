"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconLogout2,
  IconMenu2,
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

const navLinks = [
  { href: "/tema", label: "Tema" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/faq", label: "FAQ" },
];

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-green text-xs font-bold text-white">
      {initials || <IconUser size={14} />}
    </span>
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
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const itemClass = `flex min-h-11 items-center gap-3 px-4 text-sm text-brand-ink transition-colors hover:bg-brand-mint ${focusRing} focus-visible:outline-offset-[-3px]`;

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="user-menu"
        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-brand-line bg-white px-2.5 transition-colors hover:bg-brand-mint ${focusRing}`}
      >
        <UserAvatar name={name} />
        <span className="hidden max-w-[120px] truncate text-sm font-bold text-brand-ink md:block">
          {name}
        </span>
        <span className="hidden items-center gap-1 rounded-lg bg-brand-mint px-2 py-0.5 text-xs font-bold text-brand-green md:flex">
          <IconCoin size={13} aria-hidden="true" />
          {balance}
          <span className="sr-only">credit</span>
        </span>
        <IconChevronDown
          size={14}
          aria-hidden="true"
          className={`text-brand-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span className="sr-only">Menu akun</span>
      </button>

      {open && (
        // Only floating surface in the header, so it alone carries a shadow
        <div
          id="user-menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-brand-line bg-white py-1.5 shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-brand-line px-4 py-2.5 md:hidden">
            <IconCoin size={14} className="text-brand-green" aria-hidden="true" />
            <span className="text-xs text-brand-muted">Credit</span>
            <span className="ml-auto text-sm font-bold text-brand-green">{balance}</span>
          </div>
          {[
            { href: "/user/undangan-list", icon: IconLayoutDashboard, label: "Dashboard" },
            { href: "/user/profile", icon: IconUser, label: "Profil" },
            { href: "/user/credit", icon: IconCreditCard, label: "Credit & voucher" },
            ...(isAdmin ? [{ href: "/admin/users", icon: IconShield, label: "Admin" }] : []),
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={itemClass}>
              <Icon size={17} className="text-brand-leaf" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <div className="mt-1 border-t border-brand-line pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className={`w-full cursor-pointer ${itemClass} text-brand-rose hover:bg-brand-pink`}
            >
              <IconLogout2 size={17} aria-hidden="true" />
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
  const pathname = usePathname();
  const { isAuthenticated, getUserName } = useAuth();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu after navigating or on Escape
  useEffect(() => setIsOpen(false), [pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const username = getUserName() ?? "";
  const loggedIn = isLoaded && isAuthenticated();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-brand-cream text-brand-ink transition-colors duration-300 ${
        scrolled || isOpen ? "border-brand-line" : "border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className={`shrink-0 rounded-md ${focusRing}`}>
          <Image
            src="/images/kekawinan-logo.png"
            alt="Kekawinan, kembali ke beranda"
            width={400}
            height={400}
            className="h-auto w-[150px] md:w-[170px]"
            priority
          />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`py-2 text-[15px] font-bold underline-offset-8 transition-colors hover:text-brand-leaf hover:underline ${
                  active ? "text-brand-green underline decoration-brand-yellow decoration-[3px]" : ""
                } ${focusRing}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isLoaded &&
            (loggedIn ? (
              <UserDropdown name={username} onLogout={logout} />
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`hidden min-h-11 items-center px-1 text-[15px] font-bold text-brand-green underline underline-offset-[6px] md:inline-flex ${focusRing}`}
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className={`inline-flex min-h-11 items-center rounded-xl bg-brand-green px-4 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark md:px-5 md:text-[15px] ${focusRing}`}
                >
                  Daftar gratis
                </Link>
              </>
            ))}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            className={`grid size-11 cursor-pointer place-items-center rounded-xl border border-brand-line bg-white transition-colors hover:bg-brand-mint md:hidden ${focusRing}`}
          >
            {isOpen ? <IconX size={20} aria-hidden="true" /> : <IconMenu2 size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isLoaded && isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi utama"
          className="container flex flex-col border-t border-brand-line pt-2 pb-5 md:hidden"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center border-b border-brand-line/70 text-base font-bold ${
                  active ? "text-brand-green" : ""
                } ${focusRing}`}
              >
                {link.label}
              </Link>
            );
          })}
          {!loggedIn && (
            <Link
              href="/auth/login"
              className={`mt-4 inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-green text-[15px] font-bold text-brand-green ${focusRing}`}
            >
              Masuk ke akun
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
