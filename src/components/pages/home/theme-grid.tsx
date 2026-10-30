"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicTheme } from "@/lib/queries/themes-public";
import styles from "./home-brand.module.css";

const INITIAL_ROWS = 2;
const ROWS_PER_LOAD = 2;

// Must match the .themeGrid column counts in home-brand.module.css
const COLUMN_QUERIES: [string, number][] = [
  ["(max-width: 560px)", 2],
  ["(max-width: 900px)", 3],
];
const DESKTOP_COLUMNS = 5;

function getColumns() {
  for (const [query, cols] of COLUMN_QUERIES) {
    if (window.matchMedia(query).matches) return cols;
  }
  return DESKTOP_COLUMNS;
}

function subscribe(onChange: () => void) {
  const lists = COLUMN_QUERIES.map(([query]) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

export default function ThemeGrid({ themes }: { themes: PublicTheme[] }) {
  const columns = useSyncExternalStore(subscribe, getColumns, () => DESKTOP_COLUMNS);
  const [rows, setRows] = useState(INITIAL_ROWS);
  const listRef = useRef<HTMLUListElement>(null);
  const firstNewIndex = useRef<number | null>(null);

  const visible = rows * columns;
  // Before the first click, CSS hides everything past two rows at each
  // breakpoint, so phones don't flash ten cards before hydration.
  const collapsed = rows === INITIAL_ROWS;

  // Keyboard users land on the first newly shown theme instead of the button
  useEffect(() => {
    if (firstNewIndex.current === null) return;
    listRef.current
      ?.querySelectorAll<HTMLAnchorElement>(`.${styles.themeLink}`)
      [firstNewIndex.current]?.focus({ preventScroll: true });
    firstNewIndex.current = null;
  }, [rows]);

  return (
    <>
      <ul ref={listRef} className={`${styles.themeGrid} ${collapsed ? styles.themeGridCollapsed : ""}`}>
        {themes.map((theme, index) => (
          <li key={theme.id} hidden={index >= visible}>
            <Link href={`/${theme.slug}/demo`} target="_blank" rel="noopener noreferrer" className={styles.themeLink}>
              <div className={styles.themePreview}>
                <Image
                  src={theme.thumbnail ?? "/images/imgplace.png"}
                  alt={`Pratinjau ${theme.name ?? theme.componentName}`}
                  width={300}
                  height={450}
                  sizes="(max-width: 560px) 42vw, (max-width: 900px) 29vw, 260px"
                />
              </div>
              <div className={styles.themeCaption}>
                <h3>{theme.name ?? theme.componentName}</h3>
                <span>Lihat demo <span className="sr-only">(tab baru)</span><span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {visible < themes.length && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              firstNewIndex.current = visible;
              setRows((r) => r + ROWS_PER_LOAD);
            }}
          >
            Tampilkan tema lainnya
          </button>
        </div>
      )}
    </>
  );
}
