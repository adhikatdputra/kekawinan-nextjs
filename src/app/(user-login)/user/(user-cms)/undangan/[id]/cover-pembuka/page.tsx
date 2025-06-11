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
import Link from "next/link";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { formatDateIdWithTime } from "@/helper/date";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CoverPembukaPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [title, setTitle] = useState<string>("");
  const [img_thumbnail, setImgThumbnail] = useState<string>("");
  const [img_thumbnail_upload, setImgThumbnailUpload] = useState<File | null>(
    null
  );
  const [img_bg, setImgBg] = useState<string>("");
  const [img_bg_upload, setImgBgUpload] = useState<File | null>(null);
  const [stream_link, setStreamLink] = useState<string>("");
  const [music, setMusic] = useState<File | null>(null);
  const [is_music, setIsMusic] = useState<boolean>(false);
  const [date_wedding, setDateWedding] = useState<Value | null>(new Date());

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
    formData.append("title", title);
    formData.append("img_thumbnail", img_thumbnail_upload as File);
    formData.append("img_bg", img_bg_upload as File);
    formData.append("stream_link", stream_link);
    formData.append("music", music as File);
    formData.append("date_wedding", date_wedding?.toString() || "");
    updateUndanganContent(formData);
  };

  useEffect(() => {
    if (undanganContent) {
      setTitle(undanganContent.title);
      setImgThumbnail(undanganContent.img_thumbnail);
      setImgBg(undanganContent.img_bg);
      setStreamLink(undanganContent.stream_link);
      setMusic(undanganContent.music);
      if (undanganContent.music) {
        setIsMusic(true);
      }
      setDateWedding(
        undanganContent.date_wedding
          ? new Date(undanganContent.date_wedding)
          : new Date()
      );
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Cover Pembuka</h1>
        <p>
          Kamu dapat mengatur tampilan depan halaman undangan. Jangan lupa
          mengisi semua data ya biar undangan bagus maksimal
        </p>
      </div>
      <div className="grid gap-8">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <div className="md:w-1/2">
              <Label htmlFor="date" className="pb-2">
              Tanggal Pernikahan
              </Label>
              <DateTimePicker
                onChange={setDateWedding}
                value={date_wedding}
                locale="id"
                format="dd MMMM yyyy HH:mm"
                calendarIcon={<IconCalendar />}
                clearIcon={<IconX size={16} />}
                className="h-10"
              />
              {date_wedding && (
                <p className="text-sm text-muted-foreground mt-2">
                  {formatDateIdWithTime(date_wedding.toString())} WIB
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="img_thumbnail">Gambar Thumbnail</Label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <ImageUpload
                placeholder="w-32 h-32 bg-gray-200 rounded-full"
                icon={Upload}
                iconSize={32}
                defaultValue={img_thumbnail}
                onChange={(file, imageUrl) => {
                  if (file) {
                    setImgThumbnail(imageUrl as string);
                    setImgThumbnailUpload(file);
                  }
                }}
              />
              <div className="text-sm text-muted-foreground md:w-1/2">
                Foto thumbnail digunakan untuk icon website kamu dan juga gambar
                cover amplop di awal undangan (Saran dimensi: 1:1 / 300 x
                300px). Contoh:{" "}
                <Link
                  href="/images/thumb.png"
                  target="_blank"
                  className="text-green-kwn font-semibold"
                >
                  Lihat Gambar
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="img_bg">Foto Cover Undangan</Label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <ImageUpload
                placeholder="w-40 h-[200px] bg-gray-200 rounded-md"
                icon={Upload}
                iconSize={32}
                defaultValue={img_bg}
                onChange={(file, imageUrl) => {
                  if (file) {
                    setImgBg(imageUrl as string);
                    setImgBgUpload(file);
                  }
                }}
              />
              <div className="text-sm text-muted-foreground md:w-1/2">
                Upload foto calon pengantin, foto ini akan di gunakan sebagai
                cover dari undanganmu (Maks ukuran 1Mb).{" "}
                <Link
                  href="/images/cover.png"
                  target="_blank"
                  className="text-green-kwn font-semibold"
                >
                  Lihat Contoh
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Nama Pengantin / Judul Undangan</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan nama pengantin / judul undangan"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="music">Music (Optional)</Label>
            {is_music ? (
              <div className="flex gap-4 items-center">
                <audio src={music || ""} controls></audio>
                <Button variant="outline" onClick={() => setIsMusic(false)}>
                  Ganti Music
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                accept="audio/*"
                id="music"
                onChange={(e) => setMusic(e.target.files?.[0] || null)}
                placeholder="Masukkan link music"
                className="h-10"
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stream_link">Link Streaming (Optional)</Label>
            <Input
              id="stream_link"
              value={stream_link}
              onChange={(e) => setStreamLink(e.target.value)}
              placeholder="Masukkan link streaming"
              className="h-10"
            />
            <p className="text-sm text-muted-foreground">
              Kosongkan jika tidak ada link Streaming
            </p>
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
