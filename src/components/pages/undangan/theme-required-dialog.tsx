"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import PendingData from "@/components/ui/custom/pending-data";
import { useAuth } from "@/frontend/composable/useAuth";
import undanganApi from "@/frontend/api/undangan";
import themeApi from "@/frontend/api/theme";
import creditsApi from "@/frontend/api/credits";
import { Theme, UserCreditBalance } from "@/frontend/interface/undangan";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  undanganId: string;
  undanganName?: string | null;
  /** Credit yang sudah terpotong untuk undangan ini — tidak ditagih ulang */
  paidCredits?: number;
  /** Teks tambahan di bawah judul */
  description?: string;
  /** Label tombol batal; sembunyikan dengan null */
  cancelLabel?: string | null;
  onSuccess?: () => void;
}

/**
 * Dialog pemilihan tema untuk undangan yang temanya kosong.
 *
 * Tanpa tema, halaman publik undangan tidak pernah selesai loading, jadi dialog
 * ini adalah jalur pemulihannya. Credit yang sudah terpotong untuk undangan
 * tersebut tetap dihitung — user hanya membayar selisihnya kalau memilih tema
 * yang lebih mahal (perhitungan finalnya tetap di server).
 */
export default function ThemeRequiredDialog({
  open,
  onOpenChange,
  undanganId,
  undanganName,
  paidCredits = 0,
  description,
  cancelLabel = "Nanti Saja",
  onSuccess,
}: Props) {
  const { getUser } = useAuth();
  const isAdmin = getUser()?.level === "admin" || getUser()?.level === "superadmin";
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Theme | null>(null);

  const { data: themes, isLoading: isLoadingTheme } = useQuery({
    queryKey: ["themes-public"],
    queryFn: () => themeApi.getTheme(),
    select: (data) => data.data.data?.rows as Theme[],
    enabled: open,
  });

  const { data: creditData } = useQuery({
    queryKey: ["my-credits", getUser()?.id],
    queryFn: () => creditsApi.getMyCredits(),
    select: (data) => data.data.data as UserCreditBalance,
    enabled: open && !isAdmin,
  });

  const balance = creditData?.balance ?? 0;
  const budget = balance + paidCredits;
  const cost = selected
    ? (selected.promo !== null && selected.promo !== undefined ? selected.promo : selected.credit)
    : 0;
  const extra = Math.max(0, cost - paidCredits);

  const { mutate: setTheme, isPending } = useMutation({
    mutationFn: (themeId: string) => undanganApi.setUndanganTheme(undanganId, themeId),
    onSuccess: (data) => {
      if (!data.data.success) {
        toast.error(data.data.message);
        return;
      }
      toast.success("Tema undangan berhasil dipasang");
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["undangan-me"] });
      queryClient.invalidateQueries({ queryKey: ["undangan-detail", undanganId] });
      queryClient.invalidateQueries({ queryKey: ["my-credits"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Gagal memasang tema");
    },
  });

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) setSelected(null); onOpenChange(next); }}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Pilih Tema Undangan</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                Undangan <span className="font-semibold">{undanganName}</span> belum punya tema.
                Pilih satu supaya undangannya bisa dibuka tamu.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto">
          {!isAdmin && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Sudah terbayar untuk undangan ini:{" "}
                <span className="font-semibold text-green-kwn">{paidCredits} credit</span>
              </span>
              <span>
                Credit kamu: <span className="font-semibold text-green-kwn">{balance}</span>
              </span>
            </div>
          )}
          {isLoadingTheme ? (
            <PendingData />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-1">
              {themes?.map((item: Theme) => {
                const itemCost = item.promo !== null && item.promo !== undefined ? item.promo : item.credit;
                const affordable = isAdmin || budget >= itemCost;
                const isSelected = selected?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { if (affordable) setSelected(item); }}
                    className={`group relative w-full ${!affordable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className={`relative rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-green-kwn ring-offset-1" : "border border-border"}`}>
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        width={300}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs text-white px-1.5 py-0.5 rounded font-medium ${itemCost === 0 ? "bg-red-500" : "bg-green-kwn"}`}>
                          {itemCost === 0 ? "GRATIS" : `${itemCost} credit`}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center gap-1 rounded-full bg-green-kwn px-2 py-1 text-white text-xs">
                            <IconRosetteDiscountCheckFilled size={12} />
                            <span>Dipilih</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/${item.componentName?.toLowerCase()}/demo`} target="_blank">Preview</Link>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {!isAdmin && selected && (
            <p className="text-xs text-muted-foreground">
              {extra === 0
                ? "Tema ini sudah tercakup credit yang kamu bayar sebelumnya — tidak ada potongan tambahan."
                : `Tema ini butuh tambahan ${extra} credit. Sisa credit kamu setelahnya: ${balance - extra}.`}
            </p>
          )}
        </div>
        <Separator />
        <DialogFooter>
          {cancelLabel && (
            <Button variant="outline" onClick={() => { setSelected(null); onOpenChange(false); }}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            disabled={!selected || isPending}
            onClick={() => { if (selected) setTheme(selected.id); }}
          >
            {isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
              : "Pasang Tema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
