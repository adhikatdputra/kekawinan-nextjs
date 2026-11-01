"use client";

import { useState, useEffect } from "react";
import {
  CmsPageHeader,
  CmsSection,
  CmsField,
  CmsSaveBar,
  cmsInput,
  cmsFileInput,
  cmsSecondaryButton,
} from "@/components/pages/undangan/cms-ui";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import uploadApi from "@/frontend/api/upload";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import ImageUpload from "@/components/ui/custom/image-uploader";
import Link from "next/link";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { formatDateIdWithTime } from "@/helper/date";
import { useAuth } from "@/frontend/composable/useAuth";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type ApiError = { response?: { data?: { message?: string } } };

const MAX_MUSIC_SIZE_MB = 10;
const MAX_MUSIC_SIZE_BYTES = MAX_MUSIC_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

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
  const [music, setMusic] = useState<File | string | null>(null);
  const [is_music, setIsMusic] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [date_wedding, setDateWedding] = useState<Value | null>(new Date());
  const { getUser } = useAuth();
  const isAdmin = getUser()?.level === "admin" || getUser()?.level === "superadmin";

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
        toast.success("Data berhasil diubah");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Data gagal diubah");
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleMusicChange = (file: File | null) => {
    if (!file) {
      setMusic(null);
      return;
    }

    if (file.size > MAX_MUSIC_SIZE_BYTES) {
      toast.error(
        `Ukuran musik terlalu besar (${formatFileSize(file.size)}). Maksimal ${MAX_MUSIC_SIZE_MB}MB.`
      );
      setMusic(null);
      return;
    }

    setMusic(file);
  };

  const handleUpdateUndanganContent = async () => {
    let imgThumbnailUrl = img_thumbnail;
    let imgBgUrl = img_bg;
    let musicUrl = undanganContent?.music || "";

    if (music instanceof File && music.size > MAX_MUSIC_SIZE_BYTES) {
      toast.error(
        `Ukuran musik terlalu besar (${formatFileSize(music.size)}). Maksimal ${MAX_MUSIC_SIZE_MB}MB.`
      );
      return;
    }

    setIsSaving(true);
    try {
      if (img_thumbnail_upload) {
        const res = await uploadApi.uploadImage(img_thumbnail_upload, "kekawinan/thumbnail");
        imgThumbnailUrl = res.data.data.url;
      }
      if (img_bg_upload) {
        const res = await uploadApi.uploadImage(img_bg_upload, "kekawinan/cover");
        imgBgUrl = res.data.data.url;
      }
      if (music instanceof File) {
        const res = await uploadApi.uploadImage(music, "kekawinan/music");
        musicUrl = res.data.data.url;
      }

      updateUndanganContent({
        title,
        streamLink: stream_link,
        dateWedding: date_wedding ? new Date(date_wedding.toString()).toISOString() : null,
        imgThumbnail: imgThumbnailUrl,
        imgBg: imgBgUrl,
        music: musicUrl,
      });
    } catch (error) {
      const message = (error as ApiError)?.response?.data?.message;
      toast.error(
        message?.toLowerCase().includes("file size")
          ? `Ukuran musik terlalu besar. Maksimal ${MAX_MUSIC_SIZE_MB}MB.`
          : message ?? "Gagal mengupload musik"
      );
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (undanganContent) {
      setTitle(undanganContent.title || "");
      setImgThumbnail(undanganContent.imgThumbnail || "");
      setImgBg(undanganContent.imgBg || "");
      setStreamLink(undanganContent.streamLink || "");
      setMusic(undanganContent.music || null);
      if (undanganContent.music) {
        setIsMusic(true);
      }
      setDateWedding(
        undanganContent.dateWedding
          ? new Date(undanganContent.dateWedding)
          : new Date()
      );
    }
  }, [undanganContent]);

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Cover pembuka"
        description="Halaman pertama yang dilihat tamu. Isi semuanya supaya undangan tampil maksimal."
      />

      <CmsSection title="Tanggal & judul">
        <CmsField
          label="Tanggal pernikahan"
          htmlFor="date"
          hint={
            <>
              {date_wedding && (
                <span className="block font-bold text-brand-ink">
                  {formatDateIdWithTime(date_wedding.toString())} WIB
                </span>
              )}
              Undangan aktif setidaknya sampai 2 minggu setelah tanggal ini. Tanggal
              paling jauh 1 tahun sejak undangan dibuat.
            </>
          }
        >
          <div className="max-w-sm [&_.react-datetime-picker]:w-full [&_.react-datetime-picker__wrapper]:h-11 [&_.react-datetime-picker__wrapper]:rounded-xl [&_.react-datetime-picker__wrapper]:border-brand-line [&_.react-datetime-picker__wrapper]:bg-white [&_.react-datetime-picker__wrapper]:px-2">
            <DateTimePicker
              onChange={setDateWedding}
              value={date_wedding}
              locale="id"
              format="dd MMMM yyyy HH:mm"
              // Batas 1 tahun sejak undangan dibuat (server juga mengecek)
              maxDate={
                !isAdmin && undanganContent?.createdAt
                  ? new Date(new Date(undanganContent.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000)
                  : undefined
              }
              calendarIcon={<IconCalendar />}
              clearIcon={<IconX size={16} />}
            />
          </div>
        </CmsField>
        <CmsField
          label="Nama pengantin / judul undangan"
          htmlFor="title"
          hint="Contoh: Romeo & Juliet"
        >
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Romeo & Juliet"
            className={cmsInput}
          />
        </CmsField>
      </CmsSection>

      <CmsSection title="Foto">
        <div className="grid gap-6 lg:grid-cols-2">
          <CmsField
            label="Foto thumbnail"
            hint={
              <>
                Dipakai untuk ikon website dan cover amplop di awal undangan.
                Rasio 1:1, misalnya 300 × 300px.{" "}
                <Link href="/images/thumb.png" target="_blank" className="font-bold text-brand-green underline underline-offset-4">
                  Lihat contoh
                </Link>
              </>
            }
          >
            <ImageUpload
              placeholder="size-32 rounded-full bg-brand-mint"
              icon={Upload}
              iconSize={28}
              defaultValue={img_thumbnail}
              onChange={(file, imageUrl) => {
                if (file) {
                  setImgThumbnail(imageUrl as string);
                  setImgThumbnailUpload(file);
                }
              }}
            />
          </CmsField>
          <CmsField
            label="Foto cover undangan"
            hint={
              <>
                Foto calon pengantin untuk cover undangan. Maksimal 1MB.{" "}
                <Link href="/images/cover.png" target="_blank" className="font-bold text-brand-green underline underline-offset-4">
                  Lihat contoh
                </Link>
              </>
            }
          >
            <ImageUpload
              placeholder="w-40 h-[200px] rounded-xl bg-brand-mint"
              icon={Upload}
              iconSize={28}
              defaultValue={img_bg}
              onChange={(file, imageUrl) => {
                if (file) {
                  setImgBg(imageUrl as string);
                  setImgBgUpload(file);
                }
              }}
            />
          </CmsField>
        </div>
      </CmsSection>

      <CmsSection title="Musik & streaming">
        <CmsField label="Musik latar" htmlFor="music" optional>
          {is_music ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <audio
                src={music instanceof File ? URL.createObjectURL(music) : (music || "")}
                controls
                className="w-full max-w-sm"
              ></audio>
              <button type="button" className={cmsSecondaryButton} onClick={() => setIsMusic(false)}>
                Ganti musik
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="audio/*"
              id="music"
              onChange={(e) => {
                handleMusicChange(e.target.files?.[0] || null);
                e.target.value = "";
              }}
              className={cmsFileInput}
            />
          )}
        </CmsField>
        <CmsField
          label="Link streaming"
          htmlFor="stream_link"
          optional
          hint="Kosongkan kalau acaranya tidak disiarkan."
        >
          <Input
            id="stream_link"
            type="url"
            value={stream_link}
            onChange={(e) => setStreamLink(e.target.value)}
            placeholder="https://"
            className={cmsInput}
          />
        </CmsField>
      </CmsSection>

      <CmsSaveBar onSave={handleUpdateUndanganContent} pending={isSaving || isUpdating} />
    </div>
  );
}
