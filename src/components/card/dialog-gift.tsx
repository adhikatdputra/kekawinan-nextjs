"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UndanganGift } from "@/frontend/interface/undangan";
import {
  IconClipboard,
  IconCheck,
  IconCreditCard,
  IconUser,
  IconPhone,
  IconMapPin,
  IconGift,
} from "@tabler/icons-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Bold bank-style gradients (dark base → vivid accent)
const CARD_GRADIENTS = [
  "from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]",   // BCA-ish deep blue
  "from-[#14532D] via-[#166534] to-[#0D9488]",   // BNI-ish forest to teal
  "from-[#7F1D1D] via-[#B91C1C] to-[#DC2626]",   // Mandiri-ish deep red
  "from-[#78350F] via-[#B45309] to-[#D97706]",   // BSI-ish amber gold
  "from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]",   // Premium deep violet
];

// SVG circuit/maze pattern (inline, tile-based)
function CircuitPattern({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <svg
      className="absolute top-0 right-0 h-full w-[55%] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="maze"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          {/* Node dot */}
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          {/* T-junction lines — alternating pattern tiles for maze feel */}
          <line x1="12" y1="0" x2="12" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="0" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </pattern>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width="100%" height="100%" fill="url(#fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#maze)"
        style={{ color: `rgba(255,255,255,${opacity})` }}
        mask="url(#fade-mask)"
      />
    </svg>
  );
}

function GiftCard({
  gift,
  index,
  copiedId,
  onCopy,
}: {
  gift: UndanganGift;
  index: number;
  copiedId: string | null;
  onCopy: (gift: UndanganGift) => void;
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${gradient} shadow-lg`}
      style={{ aspectRatio: "1.586 / 1" }}
    >
      <CircuitPattern />

      {/* Card content */}
      <div className="relative z-10 h-full p-5 flex flex-col justify-between">
        {/* Top row — chip + bank name block (symmetric) */}
        <div className="flex items-center justify-between gap-3">
          {/* Chip */}
          <div className="w-10 h-7 rounded-md bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden shrink-0">
            <div className="grid grid-cols-2 gap-px w-5 h-4">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-white/60 rounded-[1px]" />
              ))}
            </div>
          </div>

          {/* Bank name — frosted block matching chip style */}
          <div className="flex-1 min-w-0 flex justify-end">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-3 py-1.5 max-w-[70%]">
              <p className="text-[8px] text-white/50 uppercase tracking-widest font-medium leading-none mb-0.5">
                Bank
              </p>
              <p className="text-xs font-bold text-white leading-tight truncate">
                {gift.bankName}
              </p>
            </div>
          </div>
        </div>

        {/* Account number */}
        <div>
          <p className="text-[9px] text-white/50 uppercase tracking-widest font-medium mb-1">
            Nomor Rekening
          </p>
          <button
            className="flex items-center gap-2 group"
            onClick={() => onCopy(gift)}
          >
            <span className="text-xl font-bold text-white tracking-wider leading-none">
              {gift.bankNumber}
            </span>
            <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30 group-hover:bg-white/35 transition-colors">
              {copiedId === gift.id ? (
                <IconCheck size={12} className="text-green-300" />
              ) : (
                <IconClipboard size={12} className="text-white/70" />
              )}
            </span>
          </button>
        </div>

        {/* Account holder */}
        <div>
          <p className="text-[9px] text-white/50 uppercase tracking-widest font-medium mb-0.5">
            Atas Nama
          </p>
          <p className="text-base font-bold text-white leading-none">
            {gift.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DialogGift({
  gifts,
  isOpen,
  setIsOpen,
  giftLength,
  slug,
  buttonBg = "bg-green-kwn",
}: {
  gifts: UndanganGift[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  giftLength: number;
  slug: string;
  buttonBg?: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setActiveIndex((i) => Math.min(gifts.length - 1, i + 1));

  const handleCopy = (gift: UndanganGift) => {
    navigator.clipboard.writeText(gift.bankNumber);
    toast.success("Nomor rekening berhasil disalin");
    setCopiedId(gift.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addressEntry = gifts.find(
    (g) => g.nameAddress || g.phone || g.address
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Heading */}
          <div className="flex flex-col gap-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <IconCreditCard size={18} className="text-muted-foreground" />
              <h3 className="text-lg font-bold">Amplop Digital</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Kirimkan tanda kasih untuk kedua mempelai
            </p>
          </div>

          {/* Cards */}
          {gifts.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-4">
              Belum ada rekening yang ditambahkan.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Card + nav */}
              <div className="relative px-5">
                <GiftCard
                  gift={gifts[activeIndex]}
                  index={activeIndex}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                />

                {gifts.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-25 transition-opacity hover:shadow-lg"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={activeIndex === gifts.length - 1}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-25 transition-opacity hover:shadow-lg"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {gifts.length > 1 && (
                <div className="flex gap-1.5 justify-center">
                  {gifts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeIndex
                          ? "bg-gray-700 w-5"
                          : "bg-gray-300 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Physical address & wishlist */}
          {(addressEntry || giftLength > 0) && (
            <div className="flex flex-col gap-3">
              <div className="h-px bg-border" />

              {/* Address card — shipping label style */}
              {addressEntry && (
                <div className="rounded-2xl bg-muted/50 p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <IconGift size={13} className="text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                      Kirim Hadiah Fisik
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Recipient */}
                  {addressEntry.nameAddress && (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Penerima</p>
                      <p className="text-sm font-bold leading-snug">{addressEntry.nameAddress}</p>
                    </div>
                  )}

                  {/* Phone + Address in a 2-col grid if both exist */}
                  <div className="flex flex-col gap-2">
                    {addressEntry.phone && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                          <IconPhone size={11} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-foreground">{addressEntry.phone}</p>
                      </div>
                    )}
                    {addressEntry.address && (
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                          <IconMapPin size={11} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{addressEntry.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Kado spesial button */}
              {giftLength > 0 && (
                <Link href={`/${slug}/gift`} target="_blank">
                  <Button
                    size="sm"
                    className={`w-full rounded-xl h-10 font-semibold text-white hover:opacity-90 transition-opacity ${buttonBg}`}
                  >
                    <IconGift size={15} />
                    Lihat Kado Spesial
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
