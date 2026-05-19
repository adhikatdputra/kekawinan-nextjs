import Banner from "@/components/pages/home/banner";
import MarqueeRibbon from "@/components/pages/home/marquee-ribbon";
import Features from "@/components/pages/home/features";
import Permalink from "@/components/pages/home/permalink";
import CreateUndangan from "@/components/pages/home/create-undangan";
import GiftFeature from "@/components/pages/home/gift-feature";
import Themes from "@/components/pages/home/themes";
import Testimoni from "@/components/pages/home/testimoni";
import CustomUndangan from "@/components/pages/home/custom-undangan";

export default function Homepage() {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <MarqueeRibbon />
      <Features />
      <GiftFeature />
      <Permalink />
      <CreateUndangan />
      <Themes />
      <Testimoni />
      <CustomUndangan />
    </div>
  );
}
