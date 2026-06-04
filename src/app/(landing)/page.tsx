import Banner from "@/components/pages/home/banner";
import MarqueeRibbon from "@/components/pages/home/marquee-ribbon";
import Features from "@/components/pages/home/features";
import Permalink from "@/components/pages/home/permalink";
import CreateUndangan from "@/components/pages/home/create-undangan";
import GiftFeature from "@/components/pages/home/gift-feature";
import Themes from "@/components/pages/home/themes";
import Testimoni from "@/components/pages/home/testimoni";
import CustomUndangan from "@/components/pages/home/custom-undangan";
import HomeFaq from "@/components/pages/home/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.kekawinan.com/#website",
      url: "https://www.kekawinan.com",
      name: "Kekawinan",
      description: "Platform undangan pernikahan digital gratis untuk pasangan Indonesia",
      inLanguage: "id",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.kekawinan.com/auth/register",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.kekawinan.com/#organization",
      name: "Kekawinan",
      url: "https://www.kekawinan.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kekawinan.com/images/kekawinan-logo.png",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Kekawinan",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: "https://www.kekawinan.com",
      description:
        "Buat undangan pernikahan digital gratis dan mudah. Pilih tema, tambah foto, kelola RSVP tamu, dan kirim via WhatsApp.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
        description: "Gratis selamanya",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "600",
        bestRating: "5",
        worstRating: "1",
      },
    },
  ],
};

export default function Homepage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="overflow-x-hidden">
        <Banner />
        <MarqueeRibbon />
        <Features />
        <GiftFeature />
        <Permalink />
        <CreateUndangan />
        <Themes />
        <Testimoni />
        <HomeFaq />
        <CustomUndangan />
      </div>
    </>
  );
}
