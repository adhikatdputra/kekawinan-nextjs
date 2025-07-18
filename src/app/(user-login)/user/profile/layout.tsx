import { Metadata } from "next";
import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export const metadata: Metadata = {
  title: "Profil | Kekawinan",
  description:
    "Profil Kekawinan - Ubah profil dan password kamu di sini",
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
