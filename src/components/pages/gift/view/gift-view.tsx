"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import undanganUserApi from "@/frontend/api/undangan-user";
import giftApi from "@/frontend/api/gift";
import { UndanganDetail, Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/components/card/not-found";
import { IconGift, IconCheck, IconArrowRight, IconSparkles } from "@tabler/icons-react";

export default function GiftView({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tamuId = searchParams.get("id") ?? undefined;
  const [isOpenGiftList, setIsOpenGiftList] = useState(false);
  const [giftList, setGiftList] = useState<Gift[]>([]);

  const {
    data: undanganData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
    select: (data) => data.data as UndanganDetail,
  });

  const { isPending: isLoadingGiftList, mutate: mutateGiftList } = useMutation({
    mutationFn: (undangan_id: string) => giftApi.getPublic(undangan_id),
    onSuccess: (data) => {
      setGiftList(data.data.data);
    },
  });

  useEffect(() => {
    if (isError) router.push("/");
  }, [isError]);

  useEffect(() => {
    if (undanganData) mutateGiftList(undanganData.id);
  }, [undanganData]);

  if (isLoading) return <Loading />;

  if (!undanganData)
    return (
      <NotFound
        title="Waduh, undanganmu nggak ada!"
        description="Mungkin kamu salah klik link ini, atau link ini sudah tidak ada."
      />
    );

  return (
    <>
      {!isOpenGiftList ? (
        <GiftCover
          undanganData={undanganData}
          giftCount={giftList.length}
          onOpen={() => setIsOpenGiftList(true)}
          slug={slug}
          tamuId={tamuId}
        />
      ) : (
        <GiftList
          slug={slug}
          giftList={giftList}
          isLoading={isLoadingGiftList}
          undanganData={undanganData}
        />
      )}
    </>
  );
}

// ── Cover / Landing ─────────────────────────────────────────────────
function GiftCover({
  undanganData,
  giftCount,
  onOpen,
  slug,
  tamuId,
}: {
  undanganData: UndanganDetail;
  giftCount: number;
  onOpen: () => void;
  slug: string;
  tamuId?: string;
}) {
  const thumbnail = undanganData?.content?.imgThumbnail || undanganData?.content?.imgBg;

  return (
    <div className="max-w-[450px] mx-auto min-h-screen flex flex-col bg-[#F0F7F3] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <Image
          src="/images/logo-black.svg"
          alt="Kekawinan"
          width={400}
          height={400}
          className="w-[130px]"
        />
        {giftCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1.5 bg-green-kwn/10 rounded-full px-3 py-1.5"
          >
            <IconGift size={13} className="text-green-kwn" />
            <span className="text-green-kwn text-xs font-semibold">
              {giftCount} hadiah tersedia
            </span>
          </motion.div>
        )}
      </div>

      {/* Shape grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-5 mt-4"
      >
        <div className="grid grid-cols-3 gap-2.5">
          {/* Row 1 */}
          <div className="rounded-full bg-white shadow aspect-square" />
          <div className="rounded-[20px] bg-green-kwn/70 aspect-square" />
          <div className="aspect-square flex items-center justify-center">
            <div
              className="w-full h-full"
              style={{
                background: "#4CAF50",
                clipPath: "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)",
              }}
            />
          </div>

          {/* Row 2 */}
          <div
            className="aspect-square"
            style={{
              background: "#d1e8d4",
              clipPath: "polygon(50% 0%, 95% 25%, 82% 88%, 18% 88%, 5% 25%)",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
            }}
          />
          {/* Couple photo — center */}
          <div className="aspect-square rounded-full overflow-hidden border-[3px] border-white shadow-md">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="couple"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-kwn/20 flex items-center justify-center text-3xl">💍</div>
            )}
          </div>
          <div className="rounded-[20px] bg-[#2E7D32] aspect-square" />

          {/* Row 3 */}
          <div className="col-span-2 h-12 rounded-full bg-green-kwn/40 self-center" />
          <div className="aspect-square flex items-center justify-center">
            <div
              className="w-[85%] h-[85%]"
              style={{
                background: "#4CAF50",
                clipPath: "polygon(50% 15%, 85% 0%, 100% 35%, 85% 50%, 100% 65%, 85% 100%, 50% 85%, 15% 100%, 0% 65%, 15% 50%, 0% 35%, 15% 0%)",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-center px-6 flex flex-col items-center gap-2 mt-6"
      >
        <span className="inline-flex items-center gap-1.5 bg-green-kwn/10 text-green-kwn text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          <IconGift size={12} />
          Daftar Kado Pernikahan
        </span>
        <h1 className="text-3xl font-bold font-recoleta text-gray-900 leading-tight mt-1">
          {undanganData?.content?.title}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mt-1 max-w-[300px]">
          Bantu mereka memulai babak baru dengan hadiah yang benar-benar
          dibutuhkan — kamu pilih, mereka bahagia.
        </p>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-6 mt-6 flex flex-col gap-3 pb-10"
      >
        <button
          onClick={onOpen}
          className="w-full rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
          style={{ height: "52px", background: "linear-gradient(135deg, #2E7D32, #4CAF50)", boxShadow: "0 4px 16px rgba(46,125,50,0.3)" }}
        >
          <IconGift size={16} />
          Pilih Kado untuk Mereka
          <IconArrowRight size={15} />
        </button>
        <Link href={tamuId ? `/${slug}/${tamuId}` : `/${slug}/demo`}>
          <button className="w-full h-12 rounded-2xl font-medium text-gray-500 text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            Kembali ke Undangan
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

// ── Gift List ────────────────────────────────────────────────────────
function GiftList({
  slug,
  giftList,
  isLoading,
  undanganData,
}: {
  slug: string;
  giftList: Gift[];
  isLoading: boolean;
  undanganData: UndanganDetail;
}) {
  const available = giftList.filter((g) => !g.isConfirm).length;
  const taken = giftList.filter((g) => g.isConfirm).length;

  return (
    <div className="max-w-[450px] mx-auto min-h-screen flex flex-col bg-[#F0F7F3]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#F0F7F3] px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pilihan Kado</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {undanganData?.content?.title}
            </p>
          </div>
          {!isLoading && (
            <div className="flex gap-2">
              <div className="bg-green-kwn/10 rounded-xl px-3 py-1.5 text-center">
                <p className="text-green-kwn font-bold text-sm">{available}</p>
                <p className="text-[9px] text-green-kwn/70">Tersedia</p>
              </div>
              {taken > 0 && (
                <div className="bg-gray-100 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-gray-500 font-bold text-sm">{taken}</p>
                  <p className="text-[9px] text-gray-400">Diambil</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-black/5 mt-4" />
      </div>

      {/* Product grid */}
      <div className="px-5 pb-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array(4).fill(null).map((_, i) => <GiftCardLoading key={i} />)}
          </div>
        ) : giftList.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <IconGift size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Belum ada hadiah yang ditambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 items-start">
            {giftList.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="h-full"
              >
                <Link href={`/${slug}/gift/${gift.id}`} className="h-full block">
                  <GiftCard gift={gift} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GiftCard({ gift }: { gift: Gift }) {
  const confirmed = !!gift.isConfirm;

  return (
    <div className={`rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col h-full ${confirmed ? "opacity-70" : ""}`}>
      {/* Image — fixed aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden shrink-0">
        <Image
          src={gift.thumbnail || ""}
          alt={gift.title}
          width={400}
          height={400}
          className={`w-full h-full object-cover ${confirmed ? "grayscale" : ""}`}
        />
        {confirmed && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow">
              <IconCheck size={18} className="text-green-kwn" />
            </div>
          </div>
        )}
      </div>

      {/* Info — fills remaining height so all cards align at bottom */}
      <div className="p-3 flex flex-col flex-1">
        {/* Fixed 2-line title area */}
        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 h-[32px] overflow-hidden">
          {gift.title}
        </p>
        {/* Price + CTA pushed to bottom */}
        <div className="mt-auto pt-2 flex flex-col gap-1">
          <p className="text-sm font-bold text-green-kwn">
            {formatNumber(Number(gift.price))}
          </p>
          <p className={`text-[10px] font-semibold ${confirmed ? "text-gray-400" : "text-green-kwn"}`}>
            {confirmed ? "✓ Sudah dihadiahkan" : "Hadiahkan →"}
          </p>
        </div>
      </div>
    </div>
  );
}

function GiftCardLoading() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded mt-1" />
      </div>
    </div>
  );
}
