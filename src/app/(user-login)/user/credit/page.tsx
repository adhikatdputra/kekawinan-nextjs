"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/frontend/composable/useAuth";
import useSession from "@/frontend/hook/useSession";
import creditsApi from "@/frontend/api/credits";
import redeemApi from "@/frontend/api/redeem";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import {
  IconLoader2,
  IconArrowDown,
  IconArrowUp,
  IconRefresh,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

type CreditHistoryItem = {
  id: string;
  type: "IN" | "OUT";
  amount: number;
  packageType: string;
  description: string;
  date: string;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// Set to true when Shopee credit is ready to launch
const isShowCredit = false;

export default function CreditPage() {
  useSession();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [redeemCode, setRedeemCode] = useState("");

  const { data: creditData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["credits"],
    queryFn: creditsApi.getMyCredits,
    enabled: isAuthenticated(),
  });
  const balance: number = creditData?.data?.data?.balance ?? 0;

  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["credit-history"],
    queryFn: creditsApi.getHistory,
    enabled: isAuthenticated(),
  });
  const history: CreditHistoryItem[] = historyData?.data?.data ?? [];

  const redeem = useMutation({
    mutationFn: () => redeemApi.redeemCode(redeemCode),
    onSuccess: (res) => {
      toast.success(res.data.message || "Kode berhasil ditukar!");
      setRedeemCode("");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["credit-history"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message ?? "Gagal menukar kode");
    },
  });

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (!code) {
      toast.error("Masukkan kode redeem terlebih dahulu");
      return;
    }
    redeem.mutate();
  };

  const focusRing =
    "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

  return (
    <main className="min-h-[80vh] bg-brand-cream pt-[88px] text-brand-ink">
      {/* Pink matches the homepage gift section, since this page is about vouchers */}
      <header className="bg-brand-pink py-9 sm:py-12">
        <div className="container grid items-center gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-14">
          <div>
            <p className="mb-3.5 text-sm font-bold">Credit & voucher</p>
            <h1 className="font-recoleta-alt text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.2] tracking-[-0.025em]">
              Punya kode voucher?
              <br />
              <span className="text-brand-rose">Tukar di sini.</span>
            </h1>
            <p className="mt-4 max-w-[480px] leading-[1.8] text-brand-muted">
              Credit dari voucher langsung masuk ke akun kamu dan tercatat di riwayat di bawah.
            </p>

            {/* Balance — hidden until Shopee credit is live */}
            {isShowCredit && (
              <p className="mt-5 inline-flex items-baseline gap-2 rounded-xl bg-brand-cream px-4 py-2.5">
                <strong className="text-[28px] text-brand-green">
                  {isLoadingBalance ? "…" : balance}
                </strong>
                <span className="text-sm text-brand-muted">credit · 1 credit untuk 1 undangan</span>
              </p>
            )}

            <form
              className="mt-7 max-w-[520px]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!redeem.isPending) handleRedeem();
              }}
            >
              <label htmlFor="voucher-code" className="mb-2.5 block text-sm font-bold">
                Kode voucher
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="voucher-code"
                  placeholder="Contoh: KKW-GRAND-XXXXX"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="voucher-hint"
                  className={`min-h-[52px] min-w-0 flex-1 rounded-xl border border-brand-muted bg-white px-4 text-base uppercase tracking-[0.06em] placeholder:normal-case placeholder:tracking-normal placeholder:text-brand-muted/60 ${focusRing}`}
                />
                <button
                  type="submit"
                  disabled={redeem.isPending || !redeemCode.trim()}
                  className={`inline-flex min-h-[52px] min-w-24 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand-green px-[22px] font-bold text-white transition-colors duration-150 hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-brand-green ${focusRing}`}
                >
                  {redeem.isPending ? (
                    <IconLoader2 size={18} className="animate-spin" aria-label="Menukar kode" />
                  ) : (
                    "Tukar"
                  )}
                </button>
              </div>
              <p id="voucher-hint" className="mt-2.5 text-[13px] leading-[1.7] text-brand-muted">
                Pakai kode voucher yang kamu dapatkan dari Kekawinan.
              </p>
            </form>
          </div>

          <div
            className="relative isolate order-first mx-auto min-h-40 w-[180px] sm:order-none sm:min-h-[260px] sm:w-full sm:max-w-[300px]"
            aria-hidden="true"
          >
            <div className="absolute inset-x-[4%] top-[10%] bottom-0 -z-10 rounded-[48%_48%_20px_20px] bg-brand-pink-deep" />
            <BrandCharacter character="gift" className="absolute -bottom-1.5 left-[9%] w-[82%]" />
          </div>
        </div>
      </header>

      <section
        className="container pt-8 pb-20 sm:pt-12"
        aria-labelledby="credit-history-heading"
      >
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
          <div>
            <h2 id="credit-history-heading" className="text-[26px] font-bold">
              Riwayat credit
            </h2>
            <p className="mt-2 text-sm leading-[1.7] text-brand-muted">
              Credit yang masuk dari voucher dan yang terpakai untuk undangan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetchHistory()}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 self-start text-sm underline underline-offset-4 ${focusRing}`}
          >
            <IconRefresh size={16} aria-hidden="true" />
            Muat ulang
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="flex flex-col gap-2.5" aria-busy="true" aria-label="Memuat riwayat">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[76px] rounded-2xl bg-[#eef2ee] motion-safe:animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-[20px] bg-brand-sky px-6 py-10 text-center">
            <BrandCharacter character="courier" className="mx-auto mb-5 w-[130px]" />
            <h3 className="text-[22px] font-bold">Belum ada riwayat.</h3>
            <p className="mx-auto mt-3 max-w-[400px] leading-[1.8] text-brand-muted">
              Setelah kamu menukar voucher, credit yang masuk akan tercatat di sini.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#e6ece6] rounded-2xl border border-brand-line bg-white">
            {history.map((item) => {
              const isIn = item.type === "IN";
              return (
                <li key={item.id} className="flex items-center gap-3.5 p-4 sm:px-6 sm:py-[18px]">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${
                      isIn ? "bg-brand-mint text-brand-green" : "bg-brand-pink text-brand-rose"
                    }`}
                    aria-hidden="true"
                  >
                    {isIn ? <IconArrowDown size={18} /> : <IconArrowUp size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold wrap-anywhere">{item.description}</p>
                    <p className="mt-0.5 text-[13px] text-brand-muted">{formatDate(item.date)}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[17px] font-bold ${isIn ? "text-brand-green" : "text-brand-rose"}`}
                  >
                    <span className="sr-only">{isIn ? "Masuk" : "Keluar"} </span>
                    {isIn ? "+" : "-"}
                    {item.amount}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
