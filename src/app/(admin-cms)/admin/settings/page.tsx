"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDateWithTime } from "@/helper/date";
import { formatNumber } from "@/helper/number";
import settingsApi from "@/frontend/api/admin/settings";
import AdminSettingsStore from "@/frontend/store/admin-settings-store";

interface Setting {
  key: string;
  value: string;
  description: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

interface SettingLog {
  id: number;
  settingKey: string;
  oldValue: string | null;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

const SETTING_LABELS: Record<string, string> = {
  credit_value: "Nilai 1 Credit (Rp)",
  min_withdrawal: "Minimum Penarikan Dana (Rp)",
};

// "50000" → "50.000"
function addDots(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// "50.000" → "50000"
function stripDots(formatted: string): string {
  return formatted.replace(/\./g, "");
}

function handleNumericInput(
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (v: string) => void,
  setDirty: () => void,
) {
  const raw = stripDots(e.target.value);
  if (raw === "" || /^\d+$/.test(raw)) {
    setter(raw);
    setDirty();
  }
}

export default function SettingsPage() {
  const { update } = AdminSettingsStore();

  const [creditValue, setCreditValue] = useState("");
  const [minWithdrawal, setMinWithdrawal] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-settings-page"],
    queryFn: () => settingsApi.getAll(),
    select: (res) => res.data.data as { settings: Setting[]; logs: SettingLog[] },
  });

  useEffect(() => {
    if (data?.settings) {
      const cv = data.settings.find((s) => s.key === "credit_value");
      const mw = data.settings.find((s) => s.key === "min_withdrawal");
      if (cv) setCreditValue(cv.value);
      if (mw) setMinWithdrawal(mw.value);
      setIsDirty(false);
    }
  }, [data]);

  const currentCreditValue = data?.settings.find((s) => s.key === "credit_value");
  const currentMinWithdrawal = data?.settings.find((s) => s.key === "min_withdrawal");

  const handleSave = () => {
    const payload: Record<string, string> = {};
    if (creditValue !== currentCreditValue?.value) payload["credit_value"] = creditValue;
    if (minWithdrawal !== currentMinWithdrawal?.value) payload["min_withdrawal"] = minWithdrawal;

    if (Object.keys(payload).length === 0) return;

    update.mutate(payload, {
      onSuccess: (res) => {
        if (res.data.success) {
          setIsDirty(false);
          refetch();
        }
      },
    });
  };

  const relevantLogs = (data?.logs ?? []).filter(
    (l) => l.settingKey === "credit_value" || l.settingKey === "min_withdrawal"
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Settings Sistem</h1>
        <p>Konfigurasi nilai credit dan batas penarikan dana creator.</p>
      </div>

      {/* Form Settings */}
      <div className="border border-border p-6 rounded-2xl grid gap-6">
        <h2 className="font-semibold text-lg">Nilai Credit & Withdrawal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credit Value */}
          <div className="grid gap-2">
            <Label>{SETTING_LABELS["credit_value"]}</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={addDots(creditValue)}
              onChange={(e) => handleNumericInput(e, setCreditValue, () => setIsDirty(true))}
              placeholder="5.000"
            />
            {currentCreditValue && (
              <p className="text-xs text-muted-foreground">
                Nilai saat ini: <span className="font-semibold text-foreground">{formatNumber(Number(currentCreditValue.value))}</span>
                {" · "}Diperbarui: {formatDateWithTime(currentCreditValue.updatedAt)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Contoh: tema dengan 5 credit → harga dasar {formatNumber(Number(creditValue || 0) * 5)}
            </p>
          </div>

          {/* Min Withdrawal */}
          <div className="grid gap-2">
            <Label>{SETTING_LABELS["min_withdrawal"]}</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={addDots(minWithdrawal)}
              onChange={(e) => handleNumericInput(e, setMinWithdrawal, () => setIsDirty(true))}
              placeholder="50.000"
            />
            {currentMinWithdrawal && (
              <p className="text-xs text-muted-foreground">
                Nilai saat ini: <span className="font-semibold text-foreground">{formatNumber(Number(currentMinWithdrawal.value))}</span>
                {" · "}Diperbarui: {formatDateWithTime(currentMinWithdrawal.updatedAt)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Creator harus punya minimal {formatNumber(Number(minWithdrawal || 0))} untuk bisa mengajukan penarikan.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!isDirty || update.isPending || isLoading}
          >
            {update.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </div>

      {/* Histori Perubahan */}
      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <h2 className="font-semibold text-lg">Histori Perubahan</h2>
        <Separator />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat histori...</p>
        ) : relevantLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada perubahan yang tercatat.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {relevantLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-0.5 text-sm border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{SETTING_LABELS[log.settingKey] ?? log.settingKey}</span>
                  <span className="text-muted-foreground text-xs">{formatDateWithTime(log.changedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="line-through">{formatNumber(Number(log.oldValue ?? 0))}</span>
                  <span>→</span>
                  <span className="text-foreground font-medium">{formatNumber(Number(log.newValue))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
