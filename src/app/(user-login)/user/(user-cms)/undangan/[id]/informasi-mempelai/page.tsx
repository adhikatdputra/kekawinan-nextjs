"use client";

import { useState, useEffect } from "react";
import {
  CmsPageHeader,
  CmsSection,
  CmsField,
  CmsSaveBar,
  cmsInput,
} from "@/components/pages/undangan/cms-ui";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import uploadApi from "@/frontend/api/upload";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import ImageUpload from "@/components/ui/custom/image-uploader";

export default function InformasiMempelaiPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [name_male, setNameMale] = useState<string>("");
  const [name_female, setNameFemale] = useState<string>("");
  const [father_male, setFatherMale] = useState<string>("");
  const [mother_male, setMotherMale] = useState<string>("");
  const [father_female, setFatherFemale] = useState<string>("");
  const [mother_female, setMotherFemale] = useState<string>("");
  const [img_male, setImgMale] = useState<string>("");
  const [img_female, setImgFemale] = useState<string>("");
  const [male_no, setMaleNo] = useState<string>("");
  const [female_no, setFemaleNo] = useState<string>("");
  const [male_upload, setMaleUpload] = useState<File | null>(null);
  const [female_upload, setFemaleUpload] = useState<File | null>(null);

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
        toast.success("Informasi mempelai berhasil diubah");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Informasi mempelai gagal diubah");
    },
  });

  const handleUpdateUndanganContent = async () => {
    let imgMaleUrl = img_male;
    let imgFemaleUrl = img_female;

    if (male_upload) {
      const res = await uploadApi.uploadImage(male_upload, "kekawinan/mempelai");
      imgMaleUrl = res.data.data.url;
    }
    if (female_upload) {
      const res = await uploadApi.uploadImage(female_upload, "kekawinan/mempelai");
      imgFemaleUrl = res.data.data.url;
    }

    updateUndanganContent({
      nameMale: name_male,
      nameFemale: name_female,
      fatherMale: father_male,
      motherMale: mother_male,
      fatherFemale: father_female,
      motherFemale: mother_female,
      maleNo: male_no,
      femaleNo: female_no,
      imgMale: imgMaleUrl,
      imgFemale: imgFemaleUrl,
    });
  };

  useEffect(() => {
    if (undanganContent) {
      setNameMale(undanganContent.nameMale || "");
      setNameFemale(undanganContent.nameFemale || "");
      setFatherMale(undanganContent.fatherMale || "");
      setMotherMale(undanganContent.motherMale || "");
      setFatherFemale(undanganContent.fatherFemale || "");
      setMotherFemale(undanganContent.motherFemale || "");
      setImgMale(undanganContent.imgMale || "");
      setImgFemale(undanganContent.imgFemale || "");
      setMaleNo(undanganContent.maleNo || "");
      setFemaleNo(undanganContent.femaleNo || "");
    }
  }, [undanganContent]);

  const sides = [
    {
      key: "female",
      title: "Mempelai wanita",
      child: "Putri",
      photo: img_female,
      onPhoto: (file: File, url: string) => {
        setImgFemale(url);
        setFemaleUpload(file);
      },
      name: [name_female, setNameFemale],
      mother: [mother_female, setMotherFemale],
      father: [father_female, setFatherFemale],
      order: [female_no, setFemaleNo],
    },
    {
      key: "male",
      title: "Mempelai pria",
      child: "Putra",
      photo: img_male,
      onPhoto: (file: File, url: string) => {
        setImgMale(url);
        setMaleUpload(file);
      },
      name: [name_male, setNameMale],
      mother: [mother_male, setMotherMale],
      father: [father_male, setFatherMale],
      order: [male_no, setMaleNo],
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Informasi mempelai"
        description="Nama dan foto kedua mempelai, beserta nama orang tua masing-masing."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {sides.map((side) => (
          <CmsSection key={side.key} title={side.title}>
            <CmsField label="Foto">
              <ImageUpload
                placeholder="size-32 rounded-full bg-brand-mint"
                icon={Upload}
                iconSize={28}
                defaultValue={side.photo}
                onChange={(file, imageUrl) => {
                  if (file) side.onPhoto(file, imageUrl as string);
                }}
              />
            </CmsField>
            <CmsField label="Nama lengkap" htmlFor={`name_${side.key}`}>
              <Input
                id={`name_${side.key}`}
                value={side.name[0]}
                onChange={(e) => side.name[1](e.target.value)}
                className={cmsInput}
              />
            </CmsField>
            <div className="grid gap-5 sm:grid-cols-2">
              <CmsField label="Nama ayah" htmlFor={`father_${side.key}`}>
                <Input
                  id={`father_${side.key}`}
                  value={side.father[0]}
                  onChange={(e) => side.father[1](e.target.value)}
                  className={cmsInput}
                />
              </CmsField>
              <CmsField label="Nama ibu" htmlFor={`mother_${side.key}`}>
                <Input
                  id={`mother_${side.key}`}
                  value={side.mother[0]}
                  onChange={(e) => side.mother[1](e.target.value)}
                  className={cmsInput}
                />
              </CmsField>
            </div>
            <CmsField
              label="Anak keberapa?"
              htmlFor={`${side.key}_no`}
              hint="Contoh: pertama, kedua, ketiga"
            >
              <Input
                id={`${side.key}_no`}
                value={side.order[0]}
                onChange={(e) => side.order[1](e.target.value)}
                className={cmsInput}
              />
            </CmsField>
            {/* Mirrors the sentence shown on the invitation */}
            <div className="rounded-xl bg-white p-4 text-sm leading-relaxed">
              <span className="mb-1 block text-xs font-bold text-brand-muted">Tampil di undangan</span>
              {side.child} {side.order[0] || "…"} dari keluarga Bpk {side.father[0] || "…"} dan
              Ibu {side.mother[0] || "…"}
            </div>
          </CmsSection>
        ))}
      </div>

      <CmsSaveBar onSave={handleUpdateUndanganContent} pending={isUpdating} />
    </div>
  );
}
