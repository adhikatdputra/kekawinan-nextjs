import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gift } from "@/frontend/interface/undangan";
import { IconClipboard } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function DialogGift({
  gift,
  isOpen,
  setIsOpen,
}: {
  gift: Gift;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {

  const handleCopy = () => {
    navigator.clipboard.writeText(gift.bank_number);
    toast.success("Nomor rekening berhasil disalin");
  };

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
              <div className="bg-[url('/images/bg-atm.png')] bg-cover bg-right rounded-lg p-6 mt-4 w-full shadow-xl flex flex-col gap-8">
                <div className="flex gap-2 justify-between items-center">
                  <Image
                    src="/images/icon-bank.png"
                    alt="logo-atm"
                    width={200}
                    height={200}
                    className="w-10"
                  />
                  <div>
                    <p className="font-bold text-xl">{gift.bank_name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm">Nomor Rekening</p>
                  <button
                    className="flex gap-4 items-center"
                    onClick={handleCopy}
                  >
                    <p className="text-2xl font-bold">{gift.bank_number}</p>
                    <IconClipboard
                      size={20}
                      className="-mt-1 text-blue-600 cursor-pointer"
                    />
                  </button>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm">Atas Nama</p>
                  <p className="text-xl font-semibold">{gift.name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-xl font-bold">Kirim Hadiah</h3>
              <div className="flex flex-col gap-1 items-start bg-gray-100 p-4 rounded-lg w-full border border-dashed border-gray-300">
                <p className="text-sm font-semibold">{gift.name_address}</p>
                <p className="text-sm">{gift.phone}</p>
                <p className="text-sm">{gift.address}</p>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
