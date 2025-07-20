"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import giftApi from "@/frontend/api/gift";
import GiftStore from "@/frontend/store/gift-store";
import { Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Input } from "@/components/ui/input";

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
    queryFn: () => giftApi.getDetail(id),
    select: (data) => data.data.data as Gift,
  });

  const handleConfirm = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    confirmGift(
      { id, data: formData },
      {
        onSuccess: () => {
          refetch();
          setIsOpen(false);
        },
      }
    );
  };

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="max-w-[450px] mx-auto min-h-screen p-6 flex flex-col relative bg-[#F9F9F9]">
        <div className="p-6 rounded-3xl shadow-xl flex flex-col gap-4 items-center bg-white">
          <div className="w-full">
            <Image
              src={giftData?.thumbnail || ""}
              alt="gift-card"
              width={1000}
              height={1000}
              className="object-cover aspect-square rounded-3xl w-full"
            />
          </div>
          <div className="flex flex-col gap-2 text-center mt-2">
            <h6 className="font-medium text-xl">{giftData?.title}</h6>
            <div className="font-bold text-lg">
              {formatNumber(Number(giftData?.price))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-12">
          {giftData?.is_confirm ? (
            <div className="text-center text-green-kwn">
              Sudah dihadiahkan oleh{" "}
              <span className="font-recoleta font-semibold">
                {giftData?.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href={giftData?.link_product || "#"} target="_blank">
                <Button className="w-full" size={"md"}>
                  Checkout Sekarang
                </Button>
              </Link>
              <Button
                variant={"outline"}
                onClick={() => setIsOpen(true)}
                className="w-full border-green-kwn text-green-kwn border-2"
                size={"md"}
              >
                Konfirmasi Pembelian
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembelian</DialogTitle>
            <DialogDescription>
              Silahkan isi form dibawah ini untuk mengkonfirmasi pembelian kado
              ini. Pastikan kamu sudah checkout kado ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="No. Whatsapp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleConfirm}
              disabled={isPendingConfirm}
            >
              {isPendingConfirm ? "Menyimpan..." : "Konfirmasi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
