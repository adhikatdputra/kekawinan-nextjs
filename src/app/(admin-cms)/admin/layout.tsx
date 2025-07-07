"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar-admin";
import { useAuth } from "@/frontend/composable/useAuth";
import Loading from "@/components/layouts/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAdmin()) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h1 className="text-2xl font-bold">
          Anda tidak memiliki akses ke halaman ini
        </h1>
        <Button asChild>
          <Link href="/">Kembali ke halaman utama</Link>
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 w-full">
        <SidebarTrigger />
        <div className="w-full mt-2 border border-border rounded-2xl p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
