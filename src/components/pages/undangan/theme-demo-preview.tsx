"use client";

import { useSyncExternalStore } from "react";

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
      {/* Shadow marks the one element lifted off the page: the device */}
      <div className="w-[390px] h-[min(844px,calc(100vh-7rem))] rounded-[2.75rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl shadow-gray-900/20 overflow-hidden">
        <iframe
          src={embedUrl}
          title={`Pratinjau undangan tema ${themeName}`}
          className="w-full h-full rounded-[2rem] bg-white"
        />
      </div>
      <p className="text-sm text-gray-500">
        Gulir di dalam layar untuk melihat seluruh undangan.{" "}
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener"
          className="text-green-kwn underline underline-offset-2"
        >
          Buka penuh
        </a>
      </p>
    </div>
  );
}
