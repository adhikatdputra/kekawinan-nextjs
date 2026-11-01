"use client";

import { useSyncExternalStore } from "react";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// Desktop: the invitation runs inside a phone-sized iframe. Themes size their
// cover with h-screen and pin the music/gift buttons with position: fixed, so
// only a real viewport of phone size makes them look the way guests see them.
// Mobile: the invitation renders directly (children), unchanged.
export default function ThemeDemoPreview({
  slug,
  themeName,
  children,
}: {
  slug: string;
  themeName: string;
  children: React.ReactNode;
}) {
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => null,
  );

  // Unknown on the server; the invitation itself only renders client-side
  // anyway, so nothing is lost by waiting for the first client render.
  if (isDesktop === null) return null;
  if (!isDesktop) return <>{children}</>;

  const embedUrl = `/${slug}/demo?embed=1`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative isolate px-10 pt-8">
        {/* Arch behind the phone, like the scenes on the homepage */}
        <div
          className="absolute inset-x-0 top-0 bottom-16 -z-10 rounded-[48%_48%_28px_28px] bg-brand-pink-deep/70"
          aria-hidden="true"
        />
        {/* Shadow marks the one element lifted off the page: the device */}
        <div className="h-[min(844px,calc(100vh-9rem))] w-[390px] overflow-hidden rounded-[2.75rem] border-[10px] border-brand-ink bg-brand-ink shadow-2xl shadow-brand-ink/25">
          <iframe
            src={embedUrl}
            title={`Pratinjau undangan tema ${themeName}`}
            className="h-full w-full rounded-[2rem] bg-white"
          />
        </div>
        <BrandCharacter
          character="gift"
          className="pointer-events-none absolute -bottom-4 -left-6 w-[120px]"
        />
      </div>
      <p className="text-sm text-brand-muted">
        Gulir di dalam layar untuk melihat seluruh undangan.{" "}
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener"
          className="font-bold text-brand-green underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus"
        >
          Buka penuh
        </a>
      </p>
    </div>
  );
}
