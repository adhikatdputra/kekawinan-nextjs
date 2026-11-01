import Link from "next/link";
import { Theme } from "@/frontend/interface/undangan";

// Name and demo link under each theme card in the pickers. The link sits
// outside the card's select button, since a link can't live inside a button.
export default function ThemePickerCaption({ theme }: { theme: Pick<Theme, "name" | "componentName" | "isShowAdmin"> }) {
  return (
    <div className="mt-1.5 flex items-start justify-between gap-2 text-xs">
      <span className="min-w-0">
        <span className="block truncate font-semibold">{theme.name}</span>
        {theme.isShowAdmin && (
          <span className="mt-0.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
            Hanya admin
          </span>
        )}
      </span>
      <Link
        href={`/${theme.componentName?.toLowerCase()}/demo`}
        target="_blank"
        className="shrink-0 text-green-kwn underline underline-offset-2"
      >
        Preview
        <span className="sr-only"> tema {theme.name} (tab baru)</span>
      </Link>
    </div>
  );
}
