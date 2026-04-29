"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UndanganGift } from "@/frontend/interface/undangan";
import { IconClipboard, IconCheck } from "@tabler/icons-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DialogGift({
  gifts,
  isOpen,
  setIsOpen,
  giftLength,
  slug,
}: {
  gifts: UndanganGift[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  giftLength: number;
  slug: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setActiveIndex((i) => Math.min(gifts.length - 1, i + 1));

  const handleCopy = (gift: UndanganGift) => {
    navigator.clipboard.writeText(gift.bankNumber);
    toast.success("Nomor rekening berhasil disalin");
    setCopiedId(gift.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Use first entry with an address for the physical delivery section
  const addressEntry = gifts.find((g) => g.nameAddress || g.phone || g.address);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 text-center justify-center">
              <h3 className="text-xl font-bold">Amplop Digital</h3>
              <p className="text-sm">
                Tanpa mengurangi rasa hormat, Anda dapat mengirimkan tanda kasih
                untuk kedua mempelai melalui nomor rekening / alamat berikut:
              </p>

              {gifts.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Belum ada rekening yang ditambahkan.</p>
              )}

              {gifts.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {/* Card + arrows */}
                  <div className="relative">
                    <div className="bg-[url('/images/bg-atm.png')] bg-cover bg-right rounded-lg p-6 w-full shadow-xl flex flex-col gap-8">
                      <div className="flex gap-2 justify-between items-center">
                        <Image
                          src="/images/icon-bank.png"
                          alt="logo-atm"
                          width={200}
                          height={200}
                          className="w-10"
                        />
                        <div>
                          <p className="font-bold text-xl">{gifts[activeIndex].bankName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <p className="text-sm">Nomor Rekening</p>
                        <button
                          className="flex gap-4 items-center"
                          onClick={() => handleCopy(gifts[activeIndex])}
                        >
                          <p className="text-2xl font-bold">{gifts[activeIndex].bankNumber}</p>
                          {copiedId === gifts[activeIndex].id ? (
                            <IconCheck size={20} className="-mt-1 text-green-kwn" />
                          ) : (
                            <IconClipboard size={20} className="-mt-1 text-blue-600 cursor-pointer" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <p className="text-sm">Atas Nama</p>
                        <p className="text-xl font-semibold">{gifts[activeIndex].name}</p>
                      </div>
                    </div>

                    {/* Arrows — centered vertically on card sides */}
                    {gifts.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          disabled={activeIndex === 0}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 transition-opacity"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={activeIndex === gifts.length - 1}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 transition-opacity"
                        >
                          <ChevronRight size={20} />
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
                          className={`h-2 rounded-full transition-all ${
                            i === activeIndex ? "bg-gray-700 w-4" : "bg-gray-300 w-2"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {(addressEntry || giftLength > 0) && (
              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-xl font-bold">Kirim Hadiah</h3>
                <div className="flex flex-col gap-1 items-start bg-gray-100 p-4 rounded-lg w-full border border-dashed border-gray-300">
                  {addressEntry && (
                    <>
                      <p className="font-semibold">{addressEntry.nameAddress}</p>
                      <p className="text-left">{addressEntry.phone}</p>
                      <p className="text-left">{addressEntry.address}</p>
                      <hr />
                    </>
                  )}
                  {giftLength > 0 && (
                    <>
                      <h3 className="font-bold mt-4">Pilihan Kado Spesial</h3>
                      <Link href={`/${slug}/gift`} target="_blank">
                        <Button className="w-full rounded-lg bg-gray-500">
                          Lihat Kado Spesial
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
