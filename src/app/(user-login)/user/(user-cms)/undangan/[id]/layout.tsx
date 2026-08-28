import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar";
import ThemeRequiredGate from "@/components/pages/undangan/theme-required-gate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 w-full">
        {/* Undangan tanpa tema tidak bisa tampil — minta temanya begitu masuk */}
        <ThemeRequiredGate />
        <SidebarTrigger />
        <div className="w-full mt-2 border border-border rounded-2xl p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
