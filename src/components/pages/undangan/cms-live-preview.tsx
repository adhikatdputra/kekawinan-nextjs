"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import undanganApi from "@/frontend/api/undangan";

// Only the Content Management pages change what the invitation looks like
const PREVIEW_SECTIONS = [
  "cover-pembuka",
  "informasi-mempelai",
  "informasi-acara",
  "galeri-foto",
  "love-story",
];

// Wait for a burst of saves (e.g. several gallery uploads) before reloading
const RELOAD_DELAY_MS = 600;

/**
 * Phone-sized preview of the invitation next to the editor, on wide screens.
 * Reloads after every successful save on the page (any mutation, via the
 * MutationCache), so it shows what guests will see. It does not follow
 * unsaved typing.
 */
export default function CmsLivePreview() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [version, setVersion] = useState(0);

  const section = pathname.split("/").pop() ?? "";
  const enabled = PREVIEW_SECTIONS.includes(section);

  // Same key as the sidebar, so this shares its request instead of adding one
  const { data: undangan } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data as { permalink: string },
    enabled: !!id,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "success") {
        clearTimeout(timer);
        timer = setTimeout(() => setVersion((v) => v + 1), RELOAD_DELAY_MS);
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [queryClient]);

  if (!enabled || !undangan?.permalink) return null;

  const src = `/${undangan.permalink}/demo?embed=1&preview=1`;

  return (
    <aside
      aria-label="Preview undangan"
      className="hidden min-[1400px]:flex flex-col items-center gap-3 shrink-0 sticky top-4"
    >
      <div className="w-[360px] h-[min(780px,calc(100vh-6rem))] rounded-[2.5rem] border-[10px] border-brand-ink bg-brand-ink overflow-hidden">
        {/* key forces a fresh load after each save */}
        <iframe
          key={version}
          src={src}
          title="Preview undangan"
          className="w-full h-full rounded-[1.8rem] bg-white"
        />
      </div>
      <p className="max-w-[340px] text-center text-xs text-brand-muted">
        Preview diperbarui setiap kali kamu menyimpan.{" "}
        <a
          href={`/${undangan.permalink}/demo`}
          target="_blank"
          rel="noopener"
          className="font-bold text-brand-green underline underline-offset-2"
        >
          Buka penuh
        </a>
      </p>
    </aside>
  );
}
