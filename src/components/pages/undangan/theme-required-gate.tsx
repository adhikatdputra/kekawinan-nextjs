"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ThemeRequiredDialog from "@/components/pages/undangan/theme-required-dialog";
import { useAuth } from "@/frontend/composable/useAuth";
import undanganApi from "@/frontend/api/undangan";
import { UndanganDetail } from "@/frontend/interface/undangan";

/**
 * Muncul otomatis begitu user membuka detail undangan yang temanya kosong.
 * Query-nya memakai key yang sama dengan sidebar, jadi tidak ada request tambahan.
 */
export default function ThemeRequiredGate() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const { getUser } = useAuth();
  const isAdmin = getUser()?.level === "admin" || getUser()?.level === "superadmin";

  const [dismissed, setDismissed] = useState(false);

  const { data: undangan } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data as UndanganDetail,
    enabled: !!id,
  });

  // Kolaborator tidak boleh menentukan tema — itu keputusan pemilik undangan
  const canFix = !!undangan && (isAdmin || undangan.userId === getUser()?.id);
  const needsTheme = !!undangan && !undangan.theme;

  if (!needsTheme || !canFix) return null;

  return (
    <ThemeRequiredDialog
      open={!dismissed}
      onOpenChange={(open) => { if (!open) setDismissed(true); }}
      undanganId={id}
      undanganName={undangan.name}
      paidCredits={undangan._count?.userCredits ?? 0}
      description="Undangan ini belum punya tema, jadi halamannya belum bisa dibuka tamu. Pilih tema sekarang untuk mengaktifkannya."
    />
  );
}
