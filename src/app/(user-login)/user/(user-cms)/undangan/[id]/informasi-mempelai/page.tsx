"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
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
    mutationFn: (formData: FormData) =>
      undanganContentApi.updateUndanganContent(
        undanganContent?.id as string,
        formData
      ),
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

  const handleUpdateUndanganContent = () => {
    const formData = new FormData();
    formData.append("name_male", name_male);
    formData.append("name_female", name_female);
    formData.append("father_male", father_male);
    formData.append("mother_male", mother_male);
    formData.append("father_female", father_female);
    formData.append("mother_female", mother_female);
    formData.append("img_male", male_upload as File);
    formData.append("img_female", female_upload as File);
    formData.append("male_no", male_no);
    formData.append("female_no", female_no);
    updateUndanganContent(formData);
  };

  useEffect(() => {
    if (undanganContent) {
      setNameMale(undanganContent.name_male || "");
      setNameFemale(undanganContent.name_female || "");
      setFatherMale(undanganContent.father_male || "");
      setMotherMale(undanganContent.mother_male || "");
      setFatherFemale(undanganContent.father_female || "");
      setMotherFemale(undanganContent.mother_female || "");
      setImgMale(undanganContent.img_male || "");
      setImgFemale(undanganContent.img_female || "");
      setMaleNo(undanganContent.male_no || "");
      setFemaleNo(undanganContent.female_no || "");
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Informasi Mempelai</h1>
        <p>
          Masukkan data pengantin beserta nama kedua orang tua dari pengantin.
          Jangan lupa upload fotonya juga agar undangan terlihat lebih rapih
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="img_female">Foto Mempelai Wanita</Label>
            <ImageUpload
              placeholder="w-32 h-32 bg-gray-200 rounded-full"
              icon={Upload}
              iconSize={32}
              defaultValue={img_female}
              onChange={(file, imageUrl) => {
                if (file) {
                  setImgFemale(imageUrl as string);
                  setFemaleUpload(file);
                }
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name_male">Nama Mempelai Wanita</Label>
            <Input
              id="name_male"
              value={name_female}
              onChange={(e) => setNameFemale(e.target.value)}
              placeholder="Masukkan nama mempelai wanita"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mother_female">Nama Ibu Mempelai Wanita</Label>
            <Input
              id="mother_female"
              value={mother_female}
              onChange={(e) => setMotherFemale(e.target.value)}
              placeholder="Masukkan nama ibu mempelai wanita"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="father_female">Nama Ayah Mempelai Wanita</Label>
            <Input
              id="father_female"
              value={father_female}
              onChange={(e) => setFatherFemale(e.target.value)}
              placeholder="Masukkan nama ayah mempelai wanita"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="female_no">Anak Keberapa?</Label>
            <Input
              id="female_no"
              value={female_no}
              onChange={(e) => setFemaleNo(e.target.value)}
              placeholder="Masukkan anak keberapa mempelai wanita"
              className="h-10"
            />
            <p className="text-sm text-muted-foreground">
              Contoh: pertama, kedua, ketiga, dst
            </p>
          </div>
          <div className="grid gap-2">
            <div className="bg-muted rounded-md p-4 text-sm">
              Putri {female_no || "..."} dari keluarga Bpk{" "}
              {father_female || "..."}
              dan Ibu {mother_female || "..."}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="img_male">Foto Mempelai Pria</Label>
            <ImageUpload
              placeholder="w-32 h-32 bg-gray-200 rounded-full"
              icon={Upload}
              iconSize={32}
              defaultValue={img_male}
              onChange={(file, imageUrl) => {
                if (file) {
                  setImgMale(imageUrl as string);
                  setMaleUpload(file);
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name_male">Nama Mempelai Pria</Label>
            <Input
              id="name_male"
              value={name_male}
              onChange={(e) => setNameMale(e.target.value)}
              placeholder="Masukkan nama mempelai pria"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mother_male">Nama Ibu Mempelai Pria</Label>
            <Input
              id="mother_male"
              value={mother_male}
              onChange={(e) => setMotherMale(e.target.value)}
              placeholder="Masukkan nama ibu mempelai pria"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="father_male">Nama Ayah Mempelai Pria</Label>
            <Input
              id="father_male"
              value={father_male}
              onChange={(e) => setFatherMale(e.target.value)}
              placeholder="Masukkan nama ayah mempelai pria"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="male_no">Anak Keberapa?</Label>
            <Input
              id="male_no"
              value={male_no}
              onChange={(e) => setMaleNo(e.target.value)}
              placeholder="Masukkan anak keberapa mempelai pria"
              className="h-10"
            />
            <p className="text-sm text-muted-foreground">
              Contoh: pertama, kedua, ketiga, dst
            </p>
          </div>
          <div className="grid gap-2">
            <div className="bg-muted rounded-md p-4 text-sm">
              Putra {male_no || "..."} dari keluarga Bpk {father_male || "..."}
              dan Ibu {mother_male || "..."}
            </div>
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
