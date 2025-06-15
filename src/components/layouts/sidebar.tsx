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
  ArrowLeftToLine,
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

export function AppSidebar() {
  useSession();
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;

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
      title: "Amplop Digital",
      url: `/user/undangan/${id}/amplop-digital`,
      icon: Gift,
    },
    {
      title: "Setting",
      url: `/user/undangan/${id}/setting`,
      icon: Settings,
    },

    {
      title: "Kembali",
      url: `/user/undangan-list`,
      icon: ArrowLeftToLine,
    },
  ];

  const { data: undangan, isLoading } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data,
  });

  return (
    <Sidebar className="py-2">
      <SidebarHeader className="px-4">
        <Image
          src="/images/kekawinan-logo.png"
          alt="Logo"
          width={200}
          height={200}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="border-y border-gray-200 py-6 px-4 mt-4">
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-10 rounded-md" />
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-medium">{undangan?.name}</h3>
                  <p className="text-sm">{formatDate(undangan?.expired)}</p>
                </div>
                <Link href={`/${undangan?.permalink}/demo`} target="_blank">
                  <Button className="w-full rounded-full">
                    Preview Undangan
                  </Button>
                </Link>
              </>
            )}
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tamu Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === item.url && "bg-gray-200 hover:bg-gray-200"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === item.url && "bg-gray-200 hover:bg-gray-200"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="outline"
              className="w-full rounded-full bg-red-700 text-white hover:bg-red-800 hover:text-white"
            >
              Dukung Kami Sekarang
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
