type BankPalette = {
  from: string;
  via: string;
  to: string;
  tint: string;
  soft: string;
  text: string;
  border: string;
};

const DEFAULT_PALETTE: BankPalette = {
  from: "#14532d",
  via: "#16a34a",
  to: "#10b981",
  tint: "#f0fdf4",
  soft: "#dcfce7",
  text: "#15803d",
  border: "#bbf7d0",
};

const BANK_PALETTES: Record<string, BankPalette> = {
  slate: { from: "#0f172a", via: "#334155", to: "#64748b", tint: "#f8fafc", soft: "#e2e8f0", text: "#334155", border: "#cbd5e1" },
  gray: { from: "#111827", via: "#4b5563", to: "#6b7280", tint: "#f9fafb", soft: "#e5e7eb", text: "#374151", border: "#d1d5db" },
  zinc: { from: "#18181b", via: "#3f3f46", to: "#71717a", tint: "#fafafa", soft: "#e4e4e7", text: "#3f3f46", border: "#d4d4d8" },
  neutral: { from: "#171717", via: "#404040", to: "#737373", tint: "#fafafa", soft: "#e5e5e5", text: "#404040", border: "#d4d4d4" },
  stone: { from: "#1c1917", via: "#57534e", to: "#78716c", tint: "#fafaf9", soft: "#e7e5e4", text: "#44403c", border: "#d6d3d1" },
  red: { from: "#7f1d1d", via: "#dc2626", to: "#f87171", tint: "#fef2f2", soft: "#fee2e2", text: "#b91c1c", border: "#fecaca" },
  orange: { from: "#7c2d12", via: "#ea580c", to: "#fb923c", tint: "#fff7ed", soft: "#ffedd5", text: "#c2410c", border: "#fed7aa" },
  amber: { from: "#78350f", via: "#d97706", to: "#fbbf24", tint: "#fffbeb", soft: "#fef3c7", text: "#b45309", border: "#fde68a" },
  yellow: { from: "#713f12", via: "#ca8a04", to: "#fde047", tint: "#fefce8", soft: "#fef9c3", text: "#a16207", border: "#fef08a" },
  lime: { from: "#365314", via: "#65a30d", to: "#a3e635", tint: "#f7fee7", soft: "#ecfccb", text: "#4d7c0f", border: "#d9f99d" },
  green: DEFAULT_PALETTE,
  emerald: { from: "#064e3b", via: "#059669", to: "#34d399", tint: "#ecfdf5", soft: "#d1fae5", text: "#047857", border: "#a7f3d0" },
  teal: { from: "#134e4a", via: "#0d9488", to: "#2dd4bf", tint: "#f0fdfa", soft: "#ccfbf1", text: "#0f766e", border: "#99f6e4" },
  cyan: { from: "#164e63", via: "#0891b2", to: "#22d3ee", tint: "#ecfeff", soft: "#cffafe", text: "#0e7490", border: "#a5f3fc" },
  sky: { from: "#0c4a6e", via: "#0284c7", to: "#38bdf8", tint: "#f0f9ff", soft: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
  blue: { from: "#1e3a8a", via: "#2563eb", to: "#60a5fa", tint: "#eff6ff", soft: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" },
  indigo: { from: "#312e81", via: "#4f46e5", to: "#818cf8", tint: "#eef2ff", soft: "#e0e7ff", text: "#4338ca", border: "#c7d2fe" },
  violet: { from: "#4c1d95", via: "#7c3aed", to: "#a78bfa", tint: "#f5f3ff", soft: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" },
  purple: { from: "#581c87", via: "#9333ea", to: "#c084fc", tint: "#faf5ff", soft: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" },
  fuchsia: { from: "#701a75", via: "#c026d3", to: "#e879f9", tint: "#fdf4ff", soft: "#fae8ff", text: "#a21caf", border: "#f5d0fe" },
  pink: { from: "#831843", via: "#db2777", to: "#f472b6", tint: "#fdf2f8", soft: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  rose: { from: "#881337", via: "#e11d48", to: "#fb7185", tint: "#fff1f2", soft: "#ffe4e6", text: "#be123c", border: "#fecdd3" },
};

function normalizeBankColor(color?: string | null) {
  return color?.trim().toLowerCase() || "green";
}

export function getBankPalette(color?: string | null) {
  return BANK_PALETTES[normalizeBankColor(color)] ?? DEFAULT_PALETTE;
}

export function getBankGradient(color?: string | null) {
  const palette = getBankPalette(color);
  return `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 55%, ${palette.to} 100%)`;
}
