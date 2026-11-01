"use client";

import { useState, useEffect } from "react";
import {
  CmsPageHeader,
  CmsSection,
  CmsField,
  CmsSaveBar,
  cmsInput,
  cmsTextarea,
} from "@/components/pages/undangan/cms-ui";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

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
    mutationFn: (body: object) =>
      undanganContentApi.updateUndanganContent(id, body),
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
    updateUndanganContent({
      akadTime: akad_time,
      akadPlace: akad_place,
      resepsiTime: resepsi_time,
      resepsiPlace: resepsi_place,
      gmaps,
    });
  };

  useEffect(() => {
    if (undanganContent) {
      setAkadTime(undanganContent.akadTime || "");
      setAkadPlace(undanganContent.akadPlace || "");
      setResepsiTime(undanganContent.resepsiTime || "");
      setResepsiPlace(undanganContent.resepsiPlace || "");
      setGmaps(undanganContent.gmaps || "");
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Informasi acara"
        description="Waktu dan tempat acara, supaya tamu tahu kapan dan ke mana harus datang."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <CmsSection title="Akad nikah">
          <CmsField label="Waktu" htmlFor="akad_time" hint="Contoh: 3 Desember 2022 • 15.00 - 17.00 WIB">
            <Input
              id="akad_time"
              value={akad_time}
              onChange={(e) => setAkadTime(e.target.value)}
              placeholder="3 Desember 2022 • 15.00 - 17.00 WIB"
              className={cmsInput}
            />
          </CmsField>
          <CmsField label="Lokasi" htmlFor="akad_place" hint="Nama gedung dan alamat lengkap.">
            <Textarea
              id="akad_place"
              value={akad_place}
              onChange={(e) => setAkadPlace(e.target.value)}
              className={cmsTextarea}
            />
          </CmsField>
        </CmsSection>

        <CmsSection title="Resepsi">
          <CmsField label="Waktu" htmlFor="resepsi_time" hint="Contoh: 3 Desember 2022 • 19.00 - 21.00 WIB">
            <Input
              id="resepsi_time"
              value={resepsi_time}
              onChange={(e) => setResepsiTime(e.target.value)}
              placeholder="3 Desember 2022 • 19.00 - 21.00 WIB"
              className={cmsInput}
            />
          </CmsField>
          <CmsField label="Lokasi" htmlFor="resepsi_place" hint="Nama gedung dan alamat lengkap.">
            <Textarea
              id="resepsi_place"
              value={resepsi_place}
              onChange={(e) => setResepsiPlace(e.target.value)}
              className={cmsTextarea}
            />
          </CmsField>
        </CmsSection>
      </div>

      <CmsSection title="Peta lokasi">
        <CmsField
          label="Link Google Maps"
          htmlFor="gmaps"
          hint="Buka lokasinya di Google Maps, pilih Bagikan, lalu salin link-nya ke sini."
        >
          <Input
            id="gmaps"
            value={gmaps}
            onChange={(e) => setGmaps(e.target.value)}
            placeholder="https://maps.app.goo.gl/…"
            className={cmsInput}
          />
        </CmsField>
      </CmsSection>

      <CmsSaveBar onSave={handleUpdateUndanganContent} pending={isUpdating} />
    </div>
  );
}
