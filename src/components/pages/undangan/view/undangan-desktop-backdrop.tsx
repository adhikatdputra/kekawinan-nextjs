// Desktop only: fills the space left of the invitation column with the couple's
// cover photo, their names and date, and the theme's own decoration assets.
// Purely visual (aria-hidden): the same information is in the invitation.

type Corner = "tl" | "tr" | "bl" | "br" | "strip";

type Decor = {
  // Light tone of the theme's accent, readable on the dark photo overlay
  accent: string;
  images: { src: string; at: Corner }[];
};

// Positions mirror where each theme places these assets in its hero section.
// Themes 11-14 draw their ornaments in CSS/SVG, so they have no images here.
const THEME_DECOR: Record<string, Decor> = {
  theme1: { accent: "#E2CDBE", images: [{ src: "/images/theme1/bunga1.png", at: "bl" }, { src: "/images/theme1/bunga2.png", at: "br" }] },
  theme2: { accent: "#C8CFA0", images: [] },
  theme3: { accent: "#F0B5B0", images: [{ src: "/images/theme3/bunga1.png", at: "bl" }, { src: "/images/theme3/bunga2.png", at: "br" }] },
  theme4: { accent: "#C9D8B6", images: [{ src: "/images/theme4/flower1.png", at: "tr" }, { src: "/images/theme4/flower2.png", at: "bl" }] },
  theme5: { accent: "#9DB8FF", images: [{ src: "/images/theme5/flower1.png", at: "bl" }, { src: "/images/theme5/flower2.png", at: "br" }] },
  theme6: { accent: "#CDB8F5", images: [{ src: "/images/theme6/bunga2.png", at: "tr" }] },
  theme7: { accent: "#F5BFC8", images: [{ src: "/images/theme7/bunga1.png", at: "bl" }, { src: "/images/theme7/bunga2.png", at: "tr" }] },
  theme8: { accent: "#8FB2FF", images: [{ src: "/images/theme5/flower1.png", at: "bl" }, { src: "/images/theme5/flower2.png", at: "br" }] },
  theme9: { accent: "#C7A6F2", images: [{ src: "/images/theme6/bunga2.png", at: "tr" }] },
  theme10: { accent: "#F0B99A", images: [{ src: "/images/theme1/daunkiri.png", at: "tl" }, { src: "/images/theme1/daunkanan.png", at: "tr" }] },
  theme11: { accent: "#00C9B8", images: [] },
  theme12: { accent: "#D8B4FE", images: [] },
  theme13: { accent: "#F48FB1", images: [] },
  theme14: { accent: "#C8C1F0", images: [] },
  theme15: { accent: "#D4B060", images: [{ src: "/images/theme3/daunkiri.png", at: "bl" }, { src: "/images/theme3/bunga.png", at: "br" }] },
  theme16: { accent: "#B8975A", images: [{ src: "/images/assets/flowers-long.png", at: "strip" }] },
};

const FALLBACK: Decor = { accent: "#E5E7EB", images: [] };

const POSITION: Record<Corner, string> = {
  tl: "top-0 left-0 w-[260px]",
  tr: "top-0 right-0 w-[260px]",
  bl: "bottom-0 left-0 w-[280px]",
  br: "bottom-0 right-0 w-[280px]",
  strip: "bottom-0 inset-x-0 w-full max-h-[45%] object-cover object-top",
};

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default function UndanganDesktopBackdrop({
  componentName,
  imgBg,
  couple,
  dateWedding,
}: {
  componentName: string | null | undefined;
  imgBg: string | null | undefined;
  couple: string;
  dateWedding: string | null | undefined;
}) {
  const decor = THEME_DECOR[componentName?.toLowerCase() ?? ""] ?? FALLBACK;
  const date = formatDate(dateWedding);

  return (
    <div
      aria-hidden
      className="hidden lg:block fixed inset-y-0 left-0 right-[450px] overflow-hidden bg-gray-900 bg-cover bg-center"
      style={imgBg ? { backgroundImage: `url(${imgBg})` } : undefined}
    >
      {/* Dark overlay keeps white text readable on any photo */}
      <div className="absolute inset-0 bg-black/55" />

      {decor.images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.src + img.at}
          src={img.src}
          alt=""
          className={`absolute pointer-events-none select-none ${POSITION[img.at]}`}
        />
      ))}

      <div className="relative h-full flex flex-col items-center justify-center px-16 text-center text-white">
        <p
          className="text-sm tracking-[0.3em] uppercase mb-6"
          style={{ color: decor.accent }}
        >
          Undangan Pernikahan
        </p>
        <h2 className="font-recoleta text-6xl xl:text-7xl leading-tight max-w-2xl">
          {couple}
        </h2>
        {date && (
          <>
            <div className="w-24 h-px my-8" style={{ backgroundColor: decor.accent }} />
            <p className="text-lg text-white/90">{date}</p>
          </>
        )}
      </div>
    </div>
  );
}
