"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/frontend/composable/useAuth";
import useSession from "@/frontend/hook/useSession";
import creditsApi from "@/frontend/api/credits";
import redeemApi from "@/frontend/api/redeem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconCoin,
  IconLoader2,
  IconArrowDown,
  IconArrowUp,
  IconTicket,
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

  return (
    <main className="min-h-screen bg-green-soft-kwn pt-24 pb-16">
      <div className="container max-w-3xl mx-auto flex flex-col gap-6">

        {/* Balance Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Credit Kamu</p>
            {isLoadingBalance ? (
              <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-center gap-2">
                <IconCoin size={28} className="text-green-kwn" />
                <span className="text-4xl font-bold text-green-kwn">{balance}</span>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-gray-400 max-w-[160px]">
            1 credit digunakan untuk membuat 1 undangan
          </div>
        </div>

        {/* Redeem Code */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <IconTicket size={20} className="text-green-kwn" />
            <h2 className="font-bold text-gray-800">Tukar Kode</h2>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Masukkan kode redeem (contoh: KAWIN-XXXXX)"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && !redeem.isPending && handleRedeem()}
              className="border-green-kwn rounded-full px-4 h-11 bg-white flex-1 uppercase tracking-wider"
            />
            <Button
              onClick={handleRedeem}
              disabled={redeem.isPending || !redeemCode.trim()}
              className="rounded-full h-11 px-6 flex-shrink-0"
            >
              {redeem.isPending ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                "Tukar"
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Masukkan kode yang kamu dapatkan dari Kekawinan untuk menambah credit.
          </p>
        </div>

        {/* History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCoin size={20} className="text-green-kwn" />
              <h2 className="font-bold text-gray-800">Riwayat Credit</h2>
            </div>
            <button
              onClick={() => refetchHistory()}
              className="text-gray-400 hover:text-green-kwn transition-colors"
              title="Refresh"
            >
              <IconRefresh size={16} />
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Belum ada riwayat credit
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === "IN"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {item.type === "IN" ? (
                      <IconArrowDown size={16} />
                    ) : (
                      <IconArrowUp size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                  </div>
                  <div
                    className={`text-sm font-bold flex-shrink-0 ${
                      item.type === "IN" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.type === "IN" ? "+" : "-"}{item.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
