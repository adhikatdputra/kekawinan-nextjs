"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AmplopDigitalPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [bank_name, setBankName] = useState<string>("");
  const [bank_number, setBankNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [name_address, setNameAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const { data: gift, refetch } = useQuery({
    queryKey: ["undangan-gift", id],
    queryFn: () => undanganContentApi.getDataGift(id),
    select: (data) => data.data.data,
  });

  const { mutate: updateGift, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) =>
      undanganContentApi.updateGift(gift?.id as string, formData),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Amplop digital berhasil diubah");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Amplop digital gagal diubah");
    },
  });

  const handleUpdateUndanganContent = () => {
    const formData = new FormData();
    formData.append("bank_name", bank_name);
    formData.append("bank_number", bank_number);
    formData.append("name", name);
    formData.append("name_address", name_address);
    formData.append("phone", phone);
    formData.append("address", address);
    updateGift(formData);
  };

  useEffect(() => {
    if (gift) {
      setBankName(gift.bank_name);
      setBankNumber(gift.bank_number);
      setName(gift.name);
      setNameAddress(gift.name_address);
      setPhone(gift.phone);
      setAddress(gift.address);
    }
  }, [gift]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Amplop Digital</h1>
        <p>
          Dengan amplop digital, tamu undangan online dapat memberikan hadiah
          berupa uang yang di transfer ke rekening atau mengirim kado ke
          alamatmu. Lihat contoh
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Bank / eWallet</h2>
          <div className="grid gap-2">
            <Label htmlFor="bank_name">Nama Bank / eWallet</Label>
            <Input
              id="bank_name"
              value={bank_name}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Masukkan nama bank / ewallet"
              className="h-10"
            />
            <p className="text-sm text-muted-foreground">
              Contoh: DANA, OVO, Gopay, etc
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank_number">Nomor Rekening / eWallet</Label>
            <Input
              id="bank_number"
              value={bank_number}
              onChange={(e) => setBankNumber(e.target.value)}
              placeholder="Masukkan nomor rekening / ewallet"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Pemilik Rekening / eWallet </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama pemilik rekening / ewallet"
              className="h-10"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Penerima Kado</h2>
          <div className="grid gap-2">
            <Label htmlFor="name_address">Nama Penerima</Label>
            <Input
              id="name_address"
              value={name_address}
              onChange={(e) => setNameAddress(e.target.value)}
              placeholder="Masukkan nama penerima"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Alamat Pengiriman Kado</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat pengiriman kado"
              className="h-10"
            />
          </div>
        </div>
      </div>
      <div>
        <Button onClick={handleUpdateUndanganContent} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Perubahan</span>
          )}
        </Button>
      </div>
    </div>
  );
}
