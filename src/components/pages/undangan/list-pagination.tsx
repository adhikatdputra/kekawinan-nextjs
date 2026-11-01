import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-focus";

// Page numbers to show: first, last, and the current page's neighbours,
// with null marking a gap ("…")
function pageItems(page: number, total: number): (number | null)[] {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(null);
    items.push(p);
  });
  return items;
}

export default function ListPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const arrow = `grid size-11 cursor-pointer place-items-center rounded-xl border border-brand-line bg-white text-brand-ink transition-colors hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white ${focusRing}`;

  return (
    <nav aria-label="Halaman daftar undangan" className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-brand-muted">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Halaman sebelumnya" className={arrow}>
          <IconChevronLeft size={18} aria-hidden="true" />
        </button>
        {pageItems(page, totalPages).map((item, i) =>
          item === null ? (
            <span key={`gap-${i}`} className="px-1 text-brand-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Halaman ${item}`}
              className={`grid size-11 cursor-pointer place-items-center rounded-xl text-sm font-bold transition-colors ${focusRing} ${
                item === page
                  ? "bg-brand-green text-white"
                  : "border border-brand-line bg-white text-brand-ink hover:bg-brand-mint"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Halaman berikutnya" className={arrow}>
          <IconChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
