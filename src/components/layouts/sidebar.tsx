"use client";

import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GalleryHorizontalEnd,
  Images,
  UserPen,
  UserRoundPlus,
  Settings,
  CalendarHeart,
  Gift,
  CakeSlice,
  Users,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useSession from "@/frontend/hook/useSession";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

import { useQuery } from "@tanstack/react-query";
import undanganApi from "@/frontend/api/undangan";
import { formatDate } from "@/helper/date";
import { cn } from "@/lib/utils";
import { useAuth } from "@/frontend/composable/useAuth";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

export function AppSidebar() {
  useSession();
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;
  const { getUser } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      url: `/user/undangan/${id}/overview`,
      icon: LayoutDashboard,
    },
    {
      title: "Tamu Undangan",
      url: `/user/undangan/${id}/tamu-undangan`,
      icon: UserRoundPlus,
    },
  ];

  const menuGift = [
    {
      title: "Kado",
      url: `/user/undangan/${id}/kado-pernikahan`,
      icon: Gift,
    },
    {
      title: "Amplop Digital",
      url: `/user/undangan/${id}/amplop-digital`,
      icon: CakeSlice,
    },
  ];

  // Menu items.
  const items = [
    {
      title: "Cover Pembuka",
      url: `/user/undangan/${id}/cover-pembuka`,
      icon: GalleryHorizontalEnd,
    },
    {
      title: "Informasi Mempelai",
      url: `/user/undangan/${id}/informasi-mempelai`,
      icon: UserPen,
    },
    {
      title: "Informasi Acara",
      url: `/user/undangan/${id}/informasi-acara`,
      icon: CalendarHeart,
    },
    {
      title: "Galeri Foto",
      url: `/user/undangan/${id}/galeri-foto`,
      icon: Images,
    },
    {
      title: "Love Story",
      url: `/user/undangan/${id}/love-story`,
      icon: Heart,
    },
    {
      title: "Setting",
      url: `/user/undangan/${id}/setting`,
      icon: Settings,
    },
  ];

  const { data: undangan, isLoading } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data,
  });

  const isOwner = !!undangan && undangan.userId === getUser()?.id;

  const groups = [
    {
      label: "Tamu",
      items: [
        ...menuItems,
        ...(isOwner
          ? [{ title: "Kolaborator", url: `/user/undangan/${id}/kolaborator`, icon: Users }]
          : []),
      ],
    },
    { label: "Isi undangan", items },
    { label: "Kado pernikahan", items: menuGift },
  ];

  return (
    <Sidebar className="border-brand-line!">
      {/* One wrapper so the brand background also covers the mobile sheet,
          which doesn't receive Sidebar's className */}
      <div className="flex h-full min-h-0 flex-col bg-brand-cream text-brand-ink">
        <SidebarHeader className="px-4 pt-4 pb-3">
          <Link href="/user/undangan-list" className={`rounded-md ${focusRing}`}>
            <Image
              src="/images/kekawinan-logo.png"
              alt="Kekawinan"
              width={200}
              height={200}
              className="h-auto w-[150px]"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-1">
          <SidebarGroup className="px-4 pt-1 pb-3">
            <div className="rounded-2xl bg-brand-mint p-4">
              {isLoading ? (
                <div className="grid gap-2">
                  <Skeleton className="h-5 w-3/4 rounded-md bg-white/70" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-white/70" />
                  <Skeleton className="mt-2 h-11 w-full rounded-xl bg-white/70" />
                </div>
              ) : (
                <>
                  <p className="font-recoleta-alt text-lg leading-snug font-bold">{undangan?.name}</p>
                  <p className="mt-1 text-sm text-brand-muted">{formatDate(undangan?.expired)}</p>
                  <Link
                    href={`/${undangan?.permalink}/demo`}
                    target="_blank"
                    className={`mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark ${focusRing}`}
                  >
                    Preview undangan
                    <ExternalLink className="size-4" aria-hidden="true" />
                    <span className="sr-only">(buka di tab baru)</span>
                  </Link>
                </>
              )}
            </div>
          </SidebarGroup>
          {groups.map((group) => (
            <SidebarGroup key={group.label} className="px-3 py-1.5">
              <SidebarGroupLabel className="text-xs font-bold text-brand-muted">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "h-10 rounded-xl px-3 text-brand-ink hover:bg-brand-mint hover:text-brand-ink focus-visible:ring-brand-focus [&>svg]:text-brand-leaf",
                            active && "bg-brand-mint font-bold text-brand-green [&>svg]:text-brand-green"
                          )}
                        >
                          <Link href={item.url} aria-current={active ? "page" : undefined}>
                            <item.icon aria-hidden="true" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-brand-line px-4 py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button
                variant="outline"
                className="min-h-11 w-full rounded-xl border-brand-pink-deep bg-brand-pink font-bold text-brand-rose hover:bg-brand-pink-deep hover:text-brand-rose"
              >
                Dukung Kami Sekarang
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
