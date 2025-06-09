import { Metadata } from "next";
import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export const metadata: Metadata = {
  title: "Kekawinan | Undangan Pernikahan Digital",
  description:
    "Undangan Pernikahan Digital Gratis, Mudah, dan Berkesan! Buat undangan pernikahan digital yang bisa kamu atur sendiri dari tema, foto prewed, sampai playlist favorit! Gratis, gampang, dan pastinya berkesan!",
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
