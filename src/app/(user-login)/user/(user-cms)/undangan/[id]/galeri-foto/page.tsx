"use client";

import { useState, useEffect } from "react";
import {
  CmsPageHeader,
  CmsField,
  cmsFocusRing,
  cmsFileInput,
  cmsPrimaryButton,
  cmsSecondaryButton,
} from "@/components/pages/undangan/cms-ui";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganGaleriApi from "@/frontend/api/undangan-galeri";
import uploadApi from "@/frontend/api/upload";
import toast from "react-hot-toast";
import {
  IconChevronUp,
  IconChevronDown,
  IconLoader2,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { UndanganGaleri } from "@/frontend/interface/undangan";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const orderButton = `grid size-10 cursor-pointer place-items-center rounded-lg text-brand-ink transition-colors hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${cmsFocusRing}`;

export default function GaleriFotoPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [image, setImage] = useState<File | null>(null);
  const [tableData, setTableData] = useState<UndanganGaleri[]>([]);
  const [selectedItem, setSelectedItem] = useState<UndanganGaleri | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const {
    data: undanganGaleri,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["undangan-galeri", id],
    queryFn: () => undanganGaleriApi.getData(id),
    select: (data) => data.data.data,
  });

  const { mutate: createUndanganGaleri, isPending: isCreating } = useMutation({
    mutationFn: (body: object) => undanganGaleriApi.create(id, body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        setIsOpenCreate(false);
        setImage(null);
        toast.success("Data berhasil dibuat");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Data gagal dibuat");
    },
  });

  const { mutate: deleteUndanganGaleri, isPending: isPendingDelete } =
    useMutation({
      mutationFn: (galleryId: string) => undanganGaleriApi.remove(id, galleryId),
      onSuccess: (data) => {
        const response = data.data;
        if (response.success) {
          toast.success("Data berhasil dihapus");
          refetch();
        } else {
          toast.error(response.message);
        }
      },
    });

  const { mutate: moveUpFoto } = useMutation({
    mutationFn: (galleryId: string) => undanganGaleriApi.moveUp(id, galleryId),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Moveup is successful");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Moveup is failed");
    },
  });

  const { mutate: moveDownFoto } = useMutation({
    mutationFn: (galleryId: string) => undanganGaleriApi.moveDown(id, galleryId),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Movedown is successful");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Movedown is failed");
    },
  });

  const handleDeleteFoto = () => {
    deleteUndanganGaleri(selectedItem?.id as string);
  };

  const handleCreateUndanganGaleri = async () => {
    if (!image) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }
    const uploadRes = await uploadApi.uploadImage(image, "kekawinan/gallery");
    const imageUrl = uploadRes.data.data.url;
    createUndanganGaleri({ image: imageUrl });
  };

  useEffect(() => {
    if (undanganGaleri) {
      setTableData(undanganGaleri);
    }
  }, [undanganGaleri]);

  const MAX_PHOTOS = 6;
  const canAdd = tableData.length < MAX_PHOTOS;

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Galeri foto"
        description="Pilih sampai 6 foto terbaik kalian berdua untuk bagian galeri di undangan."
      />

      <section aria-labelledby="galeri-heading" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="galeri-heading" className="font-bold">Foto kamu</h2>
            <p className="mt-1 text-sm text-brand-muted">
              {isLoading ? "Memuat…" : `${tableData.length} dari ${MAX_PHOTOS} foto. Urutan di sini sama dengan di undangan.`}
            </p>
          </div>
          {canAdd && !isOpenCreate && (
            <button type="button" onClick={() => setIsOpenCreate(true)} className={cmsPrimaryButton}>
              <IconPlus size={18} aria-hidden="true" />
              Tambah foto
            </button>
          )}
        </div>

        {isOpenCreate && (
          <div className="grid gap-4 rounded-2xl border border-brand-line bg-brand-mint p-4 sm:p-6">
            <CmsField
              label="Upload foto"
              htmlFor="image"
              hint="PNG, JPG, JPEG, GIF, atau WEBP. Maksimal 1MB."
            >
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className={cmsFileInput}
              />
            </CmsField>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateUndanganGaleri}
                disabled={isCreating || !image}
                className={cmsPrimaryButton}
              >
                {isCreating ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
                    Menyimpan…
                  </>
                ) : (
                  "Simpan foto"
                )}
              </button>
              <button type="button" onClick={() => setIsOpenCreate(false)} className={cmsSecondaryButton}>
                Batal
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-brand-cream p-10 text-brand-muted">
            <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
            Memuat foto…
          </div>
        ) : tableData.length > 0 ? (
          <ol className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {tableData.map((item, index) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-brand-line bg-brand-cream">
                <Image
                  src={item.image}
                  alt={`Foto galeri ke-${index + 1}`}
                  width={400}
                  height={400}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="pl-1 text-sm font-bold text-brand-muted">#{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUpFoto(item.id)}
                      disabled={index === 0}
                      aria-label={`Pindahkan foto ke-${index + 1} ke atas`}
                      className={orderButton}
                    >
                      <IconChevronUp size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDownFoto(item.id)}
                      disabled={index === tableData.length - 1}
                      aria-label={`Pindahkan foto ke-${index + 1} ke bawah`}
                      className={orderButton}
                    >
                      <IconChevronDown size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpenDelete(true);
                        setSelectedItem(item);
                      }}
                      aria-label={`Hapus foto ke-${index + 1}`}
                      className={`${orderButton} text-brand-rose hover:bg-brand-pink`}
                    >
                      <IconTrash size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-line bg-brand-cream px-6 py-10 text-center">
            <BrandCharacter character="gift" className="w-28" />
            <p className="mt-4 font-bold">Belum ada foto</p>
            <p className="mt-1 max-w-sm text-sm text-brand-muted">
              Tambahkan foto prewedding atau momen favorit kalian berdua.
            </p>
          </div>
        )}
      </section>

      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Foto
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus foto ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpenDelete(false);
                setSelectedItem(null);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFoto}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
