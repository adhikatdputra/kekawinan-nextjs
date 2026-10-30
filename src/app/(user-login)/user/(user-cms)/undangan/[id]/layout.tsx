import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar";
import ThemeRequiredGate from "@/components/pages/undangan/theme-required-gate";
import CmsLivePreview from "@/components/pages/undangan/cms-live-preview";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 w-full">
        {/* Undangan tanpa tema tidak bisa tampil — minta temanya begitu masuk */}
        <ThemeRequiredGate />
        <SidebarTrigger />
        {/* Preview sits beside the form on wide screens (Content Management only) */}
        <div className="mt-2 flex items-start gap-6">
          <div className="flex-1 min-w-0 border border-border rounded-2xl p-6">{children}</div>
          <CmsLivePreview />
        </div>
      </main>
    </SidebarProvider>
  );
}
