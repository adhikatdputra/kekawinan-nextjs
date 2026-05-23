import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <HeaderWeb />
      {children}
      <FooterWeb />
      <Trakteer />
    </div>
  );
}
