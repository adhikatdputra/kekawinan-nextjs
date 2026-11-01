import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar";
import ThemeRequiredGate from "@/components/pages/undangan/theme-required-gate";
import CmsLivePreview from "@/components/pages/undangan/cms-live-preview";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-brand-cream p-4 text-brand-ink">
        {/* Undangan tanpa tema tidak bisa tampil — minta temanya begitu masuk */}
        <ThemeRequiredGate />
        <div className="flex items-center gap-3">
          <SidebarTrigger className="size-11 rounded-xl border border-brand-line bg-white text-brand-ink hover:bg-brand-mint" />
          <Link
            href="/user/undangan-list"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-green underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus"
          >
            <IconArrowLeft size={16} aria-hidden="true" />
            Semua undangan
          </Link>
        </div>
        {/* Preview sits beside the form on wide screens (Content Management only) */}
        <div className="mt-2 flex items-start gap-6">
          <div className="flex-1 min-w-0 rounded-2xl border border-brand-line bg-white p-4 sm:p-6">{children}</div>
          <CmsLivePreview />
        </div>
      </main>
    </SidebarProvider>
  );
}
