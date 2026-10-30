import HeaderWeb from "@/components/layouts/header-web";
import FooterWeb from "@/components/layouts/footer-web";
import Trakteer from "@/components/layouts/trakteer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // clip, not hidden: hidden makes this a scroll container and breaks position: sticky inside pages
  return (
    <div className="overflow-x-clip">
      <HeaderWeb />
      {children}
      <FooterWeb />
      <Trakteer />
    </div>
  );
}
