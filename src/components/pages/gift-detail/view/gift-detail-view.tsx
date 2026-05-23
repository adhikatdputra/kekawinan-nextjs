"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import giftApi from "@/frontend/api/gift";
import GiftStore from "@/frontend/store/gift-store";
import { Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Input } from "@/components/ui/input";
import NotFound from "@/components/card/not-found";
import { IconArrowLeft, IconCheck, IconExternalLink, IconGift } from "@tabler/icons-react";
import { motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GiftDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { confirm } = GiftStore();
  const { mutate: confirmGift, isPending: isPendingConfirm } = confirm;

  const {
    data: giftData,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["gift-detail", id],
    queryFn: () => giftApi.getPublicDetail(id),
    select: (data) => data.data.data as Gift,
  });

  const handleConfirm = () => {
    confirmGift(
      { id, data: { name, phone } },
      {
        onSuccess: () => {
          refetch();
          setIsOpen(false);
        },
      }
    );
  };

  useEffect(() => {
    if (isError) router.push("/");
  }, [isError]);

  if (isLoading) return <Loading />;

  if (!giftData)
    return (
      <NotFound
        title="Waduh, kado ini nggak ada!"
        description="Mungkin kamu salah klik link ini, atau kado ini sudah tidak tersedia."
      />
    );

  const confirmed = !!giftData.isConfirm;

  return (
    <>
      <div className="max-w-[450px] mx-auto min-h-screen bg-[#F0F7F3] flex flex-col">

        {/* Back button */}
        <div className="px-5 pt-6 pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors"
          >
            <IconArrowLeft size={18} />
            Kembali
          </button>
        </div>

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 mt-2"
        >
          <div className="relative rounded-3xl overflow-hidden aspect-square w-full shadow-sm">
            <Image
              src={giftData?.thumbnail || ""}
              alt={giftData?.title}
              width={800}
              height={800}
              className={`w-full h-full object-cover ${confirmed ? "grayscale" : ""}`}
            />
            {confirmed && (
              <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <IconCheck size={28} className="text-green-kwn" />
                </div>
                <p className="text-white font-semibold text-sm bg-black/40 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  Sudah Dihadiahkan
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Product info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-5 mt-4 bg-white rounded-3xl p-5 shadow-sm"
        >
          <h1 className="font-bold text-lg text-gray-900 leading-snug">
            {giftData?.title}
          </h1>

          {giftData?.description && (
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              {giftData.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Harga</p>
              <p className="text-2xl font-bold text-green-kwn mt-0.5">
                {formatNumber(Number(giftData?.price))}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-kwn/10 rounded-2xl px-4 py-2">
              <IconGift size={16} className="text-green-kwn" />
              <span className="text-green-kwn text-xs font-semibold">
                {confirmed ? "Terkonfirmasi" : "Tersedia"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Confirmed by info */}
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-5 mt-3 bg-green-kwn/8 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-green-kwn/15 flex items-center justify-center shrink-0">
              <IconCheck size={16} className="text-green-kwn" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hadiah ini sudah dipilih oleh</p>
              <p className="font-bold text-green-kwn text-sm">{giftData.name}</p>
            </div>
          </motion.div>
        )}

        {/* Note */}
        {!confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-5 mt-3 rounded-2xl bg-amber-50 border border-amber-100 p-4"
          >
            <p className="text-amber-700 text-xs leading-relaxed">
              💡 <span className="font-semibold">Cara memberikan:</span> Klik "Beli Sekarang" untuk
              checkout di toko online, lalu klik "Konfirmasi" agar pasangan tahu kamu
              sudah memilih hadiah ini.
            </p>
          </motion.div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-5 pb-10 pt-6 flex flex-col gap-3"
        >
          {!confirmed ? (
            <>
              <Link href={giftData?.linkProduct || "#"} target="_blank" className="w-full">
                <button
                  className="w-full h-13 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #2E7D32, #4CAF50)", height: "52px", boxShadow: "0 4px 16px rgba(46,125,50,0.3)" }}
                >
                  <IconExternalLink size={16} />
                  Beli Sekarang
                </button>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full h-12 rounded-2xl font-semibold text-green-kwn text-sm bg-white border-2 border-green-kwn/30"
              >
                Sudah Beli? Konfirmasi di Sini
              </button>
            </>
          ) : (
            <Link href={giftData?.linkProduct || "#"} target="_blank" className="w-full">
              <button className="w-full h-12 rounded-2xl font-medium text-gray-400 text-sm bg-white border border-gray-100 flex items-center justify-center gap-2">
                <IconExternalLink size={14} />
                Lihat Produk
              </button>
            </Link>
          )}
        </motion.div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-green-kwn/10 rounded-2xl flex items-center justify-center">
                <IconGift size={22} className="text-green-kwn" />
              </div>
            </div>
            <DialogTitle className="text-center">Konfirmasi Hadiah</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Yay! Terima kasih sudah memilih hadiah ini. Isi data di bawah
              agar pasangan tahu siapa yang sudah menghadiahkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Input
              type="text"
              placeholder="Nama lengkap kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11"
            />
            <Input
              type="number"
              placeholder="No. WhatsApp aktif"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl h-11"
            />
            <button
              onClick={handleConfirm}
              disabled={isPendingConfirm || !name || !phone}
              className="w-full h-12 rounded-xl font-bold text-white text-sm disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2E7D32, #4CAF50)" }}
            >
              {isPendingConfirm ? "Menyimpan..." : "Konfirmasi Hadiahku 🎁"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
