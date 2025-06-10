"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function InformasiAcaraPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [akad_time, setAkadTime] = useState<string>("");
  const [akad_place, setAkadPlace] = useState<string>("");
  const [resepsi_time, setResepsiTime] = useState<string>("");
  const [resepsi_place, setResepsiPlace] = useState<string>("");
  const [gmaps, setGmaps] = useState<string>("");

  const { data: undanganContent, refetch } = useQuery({
    queryKey: ["undangan-content", id],
    queryFn: () => undanganContentApi.getUndanganContent(id),
    select: (data) => data.data.data,
  });

  const { mutate: updateUndanganContent, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) =>
      undanganContentApi.updateUndanganContent(
        undanganContent?.id as string,
        formData
      ),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Informasi acara berhasil diubah");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Informasi acara gagal diubah");
    },
  });

  const handleUpdateUndanganContent = () => {
    const formData = new FormData();
    formData.append("akad_time", akad_time);
    formData.append("akad_place", akad_place);
    formData.append("resepsi_time", resepsi_time);
    formData.append("resepsi_place", resepsi_place);
    formData.append("gmaps", gmaps);
    updateUndanganContent(formData);
  };

  useEffect(() => {
    if (undanganContent) {
      setAkadTime(undanganContent.akad_time);
      setAkadPlace(undanganContent.akad_place);
      setResepsiTime(undanganContent.resepsi_time);
      setResepsiPlace(undanganContent.resepsi_place);
      setGmaps(undanganContent.gmaps);
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Informasi Acara Pernikahan</h1>
        <p>
          Masukkan informasi acara pernikahanmu agar memudahkan para tamu untuk
          datang ke acara bahagiamu
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="akad_time">Waktu Akad Nikah</Label>
          <Input
            id="akad_time"
            value={akad_time}
            onChange={(e) => setAkadTime(e.target.value)}
            placeholder="Masukkan waktu akad nikah"
            className="h-10"
          />
          <p className="text-sm text-muted-foreground">
            Contoh: 3 Desember 2022 • 15.00 - 17.00 WIB
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="akad_place">Lokasi Akad Nikah</Label>
          <Textarea
            id="akad_place"
            value={akad_place}
            onChange={(e) => setAkadPlace(e.target.value)}
            placeholder="Masukkan lokasi akad nikah"
          />
          <p className="text-sm text-muted-foreground">
            Nama gedung dan alamat lengkap
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resepsi_time">Waktu Resepsi Nikah</Label>
          <Input
            id="resepsi_time"
            value={resepsi_time}
            onChange={(e) => setResepsiTime(e.target.value)}
            placeholder="Masukkan waktu resepsi nikah"
            className="h-10"
          />
          <p className="text-sm text-muted-foreground">
            Contoh: 3 Desember 2022 • 15.00 - 17.00 WIB
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resepsi_place">Lokasi Resepsi Nikah</Label>
          <Textarea
            id="resepsi_place"
            value={resepsi_place}
            onChange={(e) => setResepsiPlace(e.target.value)}
            placeholder="Masukkan lokasi resepsi nikah"
          />
          <p className="text-sm text-muted-foreground">
            Nama gedung dan alamat lengkap
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resepsi_time">Lokasi Google Maps</Label>
          <Input
            id="resepsi_time"
            value={gmaps}
            onChange={(e) => setGmaps(e.target.value)}
            placeholder="Masukkan lokasi google maps"
            className="h-10"
          />
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
