"use client";

import { usePathname } from "next/navigation";
import { ArrowLeftToLine, LayoutDashboard, UserRoundPlus } from "lucide-react";
import useSession from "@/frontend/hook/useSession";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function AppSidebar() {
  useSession();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Daftar User",
      url: `/admin/users`,
      icon: UserRoundPlus,
    },
    {
      title: "Undangan",
      url: `/admin/undangan`,
      icon: LayoutDashboard,
    },
    {
      title: "Kembali",
      url: `/user/undangan-list`,
      icon: ArrowLeftToLine,
    },
  ];

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
        <SidebarGroup>
          <SidebarGroupLabel>Admin Management</SidebarGroupLabel>
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
      </SidebarContent>
    </Sidebar>
  );
}
