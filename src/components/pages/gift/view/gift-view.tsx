"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import undanganUserApi from "@/frontend/api/undangan-user";
import giftApi from "@/frontend/api/gift";
import { UndanganDetail, Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Skeleton } from "@/components/ui/skeleton";

export default function GiftView({ slug }: { slug: string }) {
  const router = useRouter();
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

  const {
    isPending: isLoadingGiftList,
    mutate: mutateGiftList,
  } = useMutation({
    mutationFn: (undangan_id: string) => giftApi.getAll(undangan_id),
    onSuccess: (data) => {
      console.log(data);
      setGiftList(data.data.data);
    },
  });

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError]);

  useEffect(() => {
    if (undanganData) {
      mutateGiftList(undanganData.id);
    }
  }, [undanganData]);

  if (isLoading) return <Loading />;

  return (
    <>
      {!isOpenGiftList ? (
        <div className="max-w-[450px] mx-auto overflow-x-hidden bg-[url('/images/bg-gift.webp')] bg-cover bg-center min-h-screen flex flex-col justify-center">
          <div className="flex flex-col gap-6 items-center px-6 py-12 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.2,
              }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/logo-black.svg"
                alt="logo"
                width={400}
                height={400}
                className="w-[180px]"
              />
            </motion.div>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.4,
              }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/pengantin.webp"
                alt="logo"
                width={1000}
                height={1000}
                className="w-[95%] mx-auto"
              />
            </motion.div>
            <motion.div
              className="text-black text-center flex flex-col gap-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.6,
              }}
              viewport={{ once: false }}
            >
              <h2 className="font-semibold text-xl">Pilihan Kado Spesial</h2>
              <motion.h1
                className="text-4xl font-semibold font-recoleta text-black"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                viewport={{ once: false }}
              >
                {undanganData?.undangan_content?.title}
              </motion.h1>
              <p>
                Berikan kenangan manis melalui hadiah pilihan untuk memulai
                hidup baru bersama.
              </p>
            </motion.div>
            <motion.div
              className="w-full flex flex-col gap-3 mt-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.8,
              }}
              viewport={{ once: false }}
            >
              <Button
                className="w-full"
                size={"md"}
                onClick={() => setIsOpenGiftList(true)}
              >
                Lihat Daftar Hadiah
              </Button>
              <Link href={`/${slug}/demo`}>
                <Button
                  variant={"outline"}
                  className="w-full text-green-kwn"
                  size={"md"}
                >
                  Nanti Aja Deh
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      ) : (
        <GiftList slug={slug} giftList={giftList} isLoading={isLoadingGiftList} />
      )}
    </>
  );
}

function GiftList({ slug, giftList, isLoading }: { slug: string, giftList: Gift[], isLoading: boolean }) {
  return (
    <div className="max-w-[450px] mx-auto min-h-screen p-6 pt-3 flex flex-col relative bg-[#F9F9F9]">
      <div className="sticky top-0 bg-white z-10 py-3 px-3">
        <h2 className="font-semibold text-xl">Pilihan Kado Spesial</h2>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <GiftLoading />
        ) : (
          giftList.map((gift) => (
            <Link key={gift.id} href={`/${slug}/gift/${gift.id}`}>
              <GiftCard gift={gift} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function GiftCard({ gift }: { gift: Gift }) {
  return (
    <div
      className={`p-3  rounded-lg shadow-xl flex gap-4 items-center ${
        gift.is_confirm ? "bg-gray-200" : "bg-white"
      }`}
    >
      <div className="w-[130px]">
        <Image
          src={gift.thumbnail || ""}
          alt="gift-card"
          width={1000}
          height={1000}
          className={`object-cover aspect-square rounded-lg ${
            gift.is_confirm ? "grayscale" : ""
          }`}
        />
      </div>
      <div className="flex flex-col gap-1 w-[calc(100%-130px)] text-left">
        <h6 className="font-medium line-clamp-2">{gift.title}</h6>
        <div className="font-bold">{formatNumber(Number(gift.price))}</div>
        <div
          className={`underline  text-sm font-medium mt-1 ${
            gift.is_confirm ? "text-gray-500" : "text-green-kwn"
          }`}
        >
          {gift.is_confirm ? "Sudah Hadiahkan" : "Hadiahkan Sekarang"}
        </div>
      </div>
    </div>
  );
}

function GiftLoading() {
    return (
      <div
        className={`p-3  rounded-lg shadow-xl flex gap-4 items-center bg-white`}
      >
        <div className="w-[130px]">
          <Skeleton className="w-full h-[130px] rounded-lg" />
        </div>
        <div className="flex flex-col gap-1 w-[calc(100%-130px)] text-left">
          <Skeleton className="w-full h-[20px] rounded-lg" />
          <Skeleton className="w-full h-[20px] rounded-lg" />
          <Skeleton className="w-full h-[20px] rounded-lg mt-1" />
        </div>
      </div>
    );
  }
