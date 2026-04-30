import { Metadata } from "next";
import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export const metadata: Metadata = {
  title: "Credit | Kekawinan",
  description: "Kelola credit undangan digital kamu di Kekawinan.",
};

export default function CreditLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HeaderWeb />
      {children}
      <FooterWeb />
      <Trakteer />
    </div>
  );
}
