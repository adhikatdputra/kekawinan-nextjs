import { IconLoader2 } from "@tabler/icons-react";

// Shared look for the "Isi undangan" form pages, matching the homepage brand

export const cmsFocusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

export const cmsInput =
  "h-11 rounded-xl border-brand-line bg-white text-base text-brand-ink md:text-sm focus-visible:border-brand-focus focus-visible:ring-brand-focus/30";

export const cmsTextarea =
  "min-h-24 rounded-xl border-brand-line bg-white text-base text-brand-ink md:text-sm focus-visible:border-brand-focus focus-visible:ring-brand-focus/30";

export const cmsFileInput = `block w-full max-w-md cursor-pointer rounded-xl text-sm text-brand-muted file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-xl file:border file:border-brand-line file:bg-white file:px-4 file:text-sm file:font-bold file:text-brand-ink hover:file:bg-brand-mint ${cmsFocusRing}`;

export const cmsPrimaryButton = `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-brand-green ${cmsFocusRing}`;

export const cmsSecondaryButton = `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-line bg-white px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-55 ${cmsFocusRing}`;

export function CmsPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="border-b border-brand-line pb-5">
      <h1 className="font-recoleta-alt text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.2] font-bold tracking-[-0.02em] text-brand-ink">
        {title}
      </h1>
      <p className="mt-2 max-w-[640px] leading-[1.7] text-brand-muted">{description}</p>
    </header>
  );
}

export function CmsSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-brand-line bg-brand-cream p-4 sm:p-6 ${className}`}>
      <h2 className="font-bold text-brand-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export function CmsField({
  label,
  htmlFor,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-sm font-bold text-brand-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-brand-muted">(opsional)</span>}
      </label>
      {children}
      {hint && <p className="text-[13px] leading-relaxed text-brand-muted">{hint}</p>}
    </div>
  );
}

/** Save button pinned to the bottom of the content card so it stays reachable on long forms */
export function CmsSaveBar({
  onSave,
  pending,
  disabled,
  label = "Simpan perubahan",
}: {
  onSave: () => void;
  pending: boolean;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 -mb-4 rounded-b-2xl border-t border-brand-line bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:-mb-6 sm:px-6">
      <button
        type="button"
        onClick={onSave}
        disabled={pending || disabled}
        className={`${cmsPrimaryButton} w-full sm:w-auto`}
      >
        {pending ? (
          <>
            <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
            Menyimpan…
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
