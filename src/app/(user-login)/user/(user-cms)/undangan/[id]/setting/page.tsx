"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const covid_list = [
  {
    name: "Tidak",
    value: 0,
  },
  {
    name: "Ya",
    value: 1,
  },
];

const religion_version_list = [
  {
    name: "Islam",
    value: "ISLAM",
  },
];

export default function SettingPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [is_covid, setIsCovid] = useState<number>(0);
  const [religion_version, setReligionVersion] = useState<string>("ISLAM");

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
        toast.success("Data berhasil diubah");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Data gagal diubah");
    },
  });

  const handleUpdateUndanganContent = () => {
    const formData = new FormData();
    formData.append("is_covid", is_covid.toString());
    formData.append("religion_version", religion_version);
    updateUndanganContent(formData);
  };

  useEffect(() => {
    if (undanganContent) {
      setIsCovid(undanganContent.is_covid);
      setReligionVersion(undanganContent.religion_version);
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Pengaturan Undangan</h1>
        <p>Pengaturan undangan untuk mensetting tampilan undangan</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="religion_version">Pilih Agama</Label>
          <Select value={religion_version} onValueChange={setReligionVersion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Agama" />
            </SelectTrigger>
            <SelectContent>
              {religion_version_list.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Mohon maaf saat ini baru tersedia versi Islam
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="covid_section">
            Section Menerapkan Protokol Covid
          </Label>
          <Select
            value={is_covid.toString()}
            onValueChange={(value) => setIsCovid(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              {covid_list.map((item) => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Jika pilih Ya, maka akan menampilkan section menerapkan protokol
            covid
          </p>
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
