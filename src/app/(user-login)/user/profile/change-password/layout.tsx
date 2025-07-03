import { Metadata } from "next";
import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export const metadata: Metadata = {
  title: "Ubah Password | Kekawinan",
  description:
    "Ubah password Kekawinan - Ubah password kamu di sini",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderWeb />
      {children}
      <FooterWeb />
      <Trakteer />
    </div>
  );
}
