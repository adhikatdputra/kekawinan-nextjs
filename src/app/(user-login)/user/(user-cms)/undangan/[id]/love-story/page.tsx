"use client";

import { useState, useEffect } from "react";
import {
  CmsPageHeader,
  CmsField,
  cmsFocusRing,
  cmsFileInput,
  cmsPrimaryButton,
  cmsSecondaryButton,
  cmsInput,
  cmsTextarea,
} from "@/components/pages/undangan/cms-ui";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import loveStoryApi from "@/frontend/api/undangan-love-story";
import uploadApi from "@/frontend/api/upload";
import { LoveStory } from "@/frontend/interface/undangan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  IconChevronUp,
  IconChevronDown,
  IconLoader2,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

const EMPTY_FORM = { waktu: "", lokasi: "", story: "" };

const orderButton = `grid size-10 cursor-pointer place-items-center rounded-lg text-brand-ink transition-colors hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${cmsFocusRing}`;

export default function LoveStoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [tableData, setTableData] = useState<LoveStory[]>([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LoveStory | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["love-story", id],
    queryFn: () => loveStoryApi.getData(id),
    select: (res) => res.data.data as LoveStory[],
  });

  useEffect(() => {
    if (data) setTableData(data);
  }, [data]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageIfNeeded = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const uploadRes = await uploadApi.uploadImage(imageFile, "kekawinan/love-story");
    return uploadRes.data.data.url as string;
  };

  // ── Mutations ───────────────────────────────────────────────────────────────

  const { mutate: createStory, isPending: isCreating } = useMutation({
    mutationFn: (body: object) => loveStoryApi.create(id, body),
  });

  const { mutate: updateStory, isPending: isUpdating } = useMutation({
    mutationFn: ({ storyId, body }: { storyId: string; body: object }) =>
      loveStoryApi.update(id, storyId, body),
  });

  const { mutate: deleteStory, isPending: isDeleting } = useMutation({
    mutationFn: (storyId: string) => loveStoryApi.remove(id, storyId),
  });

  const { mutate: moveUp } = useMutation({
    mutationFn: (storyId: string) => loveStoryApi.moveUp(id, storyId),
  });

  const { mutate: moveDown } = useMutation({
    mutationFn: (storyId: string) => loveStoryApi.moveDown(id, storyId),
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.story.trim()) {
      toast.error("Story wajib diisi");
      return;
    }
    const imageUrl = await uploadImageIfNeeded();
    createStory(
      { story: form.story, waktu: form.waktu || null, lokasi: form.lokasi || null, image: imageUrl },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            toast.success("Love story berhasil ditambahkan");
            setIsOpenCreate(false);
            resetForm();
            refetch();
          } else {
            toast.error(res.data.message);
          }
        },
        onError: () => toast.error("Gagal menambahkan love story"),
      }
    );
  };

  const handleUpdate = async () => {
    if (!form.story.trim()) {
      toast.error("Story wajib diisi");
      return;
    }
    const imageUrl = imageFile ? await uploadImageIfNeeded() : undefined;
    updateStory(
      {
        storyId: selectedItem!.id,
        body: {
          story: form.story,
          waktu: form.waktu || null,
          lokasi: form.lokasi || null,
          ...(imageUrl !== undefined && { image: imageUrl }),
        },
      },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            toast.success("Love story berhasil diperbarui");
            setIsOpenEdit(false);
            setSelectedItem(null);
            resetForm();
            refetch();
          } else {
            toast.error(res.data.message);
          }
        },
        onError: () => toast.error("Gagal memperbarui love story"),
      }
    );
  };

  const handleDelete = () => {
    deleteStory(selectedItem!.id, {
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success("Love story berhasil dihapus");
          setIsOpenDelete(false);
          setSelectedItem(null);
          refetch();
        } else {
          toast.error(res.data.message);
        }
      },
      onError: () => toast.error("Gagal menghapus love story"),
    });
  };

  const handleMoveUp = (storyId: string) => {
    moveUp(storyId, { onSuccess: () => refetch(), onError: () => toast.error("Gagal memindahkan") });
  };

  const handleMoveDown = (storyId: string) => {
    moveDown(storyId, { onSuccess: () => refetch(), onError: () => toast.error("Gagal memindahkan") });
  };

  const openEdit = (item: LoveStory) => {
    setSelectedItem(item);
    setForm({ waktu: item.waktu ?? "", lokasi: item.lokasi ?? "", story: item.story });
    setImagePreview(item.image ?? "");
    setImageFile(null);
    setIsOpenEdit(true);
  };

  // ── Shared form fields ───────────────────────────────────────────────────────

  const formFields = (
    <div className="grid gap-5">
      <CmsField label="Foto" htmlFor="story-image" optional hint="PNG, JPG, JPEG, atau WEBP. Maksimal 1MB.">
        <input
          id="story-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={cmsFileInput}
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview foto cerita"
            width={400}
            height={300}
            className="w-[140px] rounded-xl object-cover"
          />
        )}
      </CmsField>
      <div className="grid gap-5 sm:grid-cols-2">
        <CmsField label="Waktu" htmlFor="story-waktu" optional>
          <Input
            id="story-waktu"
            placeholder="Juni 2019"
            value={form.waktu}
            onChange={(e) => setForm((f) => ({ ...f, waktu: e.target.value }))}
            className={cmsInput}
          />
        </CmsField>
        <CmsField label="Lokasi" htmlFor="story-lokasi" optional>
          <Input
            id="story-lokasi"
            placeholder="Bandung"
            value={form.lokasi}
            onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
            className={cmsInput}
          />
        </CmsField>
      </div>
      <CmsField label="Cerita" htmlFor="story-text">
        <Textarea
          id="story-text"
          placeholder="Ceritakan momen ini…"
          rows={4}
          value={form.story}
          onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
          className={cmsTextarea}
          required
        />
      </CmsField>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Love story"
        description="Ceritakan perjalanan cinta kalian, dari momen pertama sampai hari bahagia."
      />

      <section aria-labelledby="story-heading" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="story-heading" className="font-bold">Cerita kalian</h2>
            <p className="mt-1 text-sm text-brand-muted">
              {isLoading ? "Memuat…" : `${tableData.length} cerita. Urutan di sini sama dengan di undangan.`}
            </p>
          </div>
          {!isOpenCreate && (
            <button
              type="button"
              onClick={() => { resetForm(); setIsOpenCreate(true); }}
              className={cmsPrimaryButton}
            >
              <IconPlus size={18} aria-hidden="true" />
              Tambah cerita
            </button>
          )}
        </div>

        {isOpenCreate && (
          <div className="rounded-2xl border border-brand-line bg-brand-mint p-4 sm:p-6">
            <h3 className="mb-4 font-bold">Cerita baru</h3>
            {formFields}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || !form.story.trim()}
                className={cmsPrimaryButton}
              >
                {isCreating ? (
                  <><IconLoader2 size={18} className="animate-spin" aria-hidden="true" />Menyimpan…</>
                ) : "Simpan cerita"}
              </button>
              <button
                type="button"
                onClick={() => { setIsOpenCreate(false); resetForm(); }}
                className={cmsSecondaryButton}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-brand-cream p-10 text-brand-muted">
            <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
            Memuat cerita…
          </div>
        ) : tableData.length > 0 ? (
          <ol className="grid gap-3">
            {tableData.map((item, index) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-brand-line bg-brand-cream p-4 sm:flex-row"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={240}
                    height={240}
                    className="aspect-[4/3] w-full shrink-0 rounded-xl object-cover sm:w-[140px]"
                  />
                ) : (
                  <div className="hidden w-[140px] shrink-0 place-items-center rounded-xl bg-brand-mint text-xs text-brand-muted sm:grid">
                    Tanpa foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-brand-muted">
                    #{index + 1}
                    {item.waktu && <> · {item.waktu}</>}
                    {item.lokasi && <> · {item.lokasi}</>}
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed">{item.story}</p>
                </div>
                <div className="flex items-start gap-1 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(item.id)}
                    disabled={index === 0}
                    aria-label={`Pindahkan cerita ke-${index + 1} ke atas`}
                    className={orderButton}
                  >
                    <IconChevronUp size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(item.id)}
                    disabled={index === tableData.length - 1}
                    aria-label={`Pindahkan cerita ke-${index + 1} ke bawah`}
                    className={orderButton}
                  >
                    <IconChevronDown size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button type="button" onClick={() => openEdit(item)} className={`${cmsSecondaryButton} px-4!`}>
                    <IconEdit size={16} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedItem(item); setIsOpenDelete(true); }}
                    className={`${cmsSecondaryButton} border-brand-pink-deep! bg-brand-pink! px-4! text-brand-rose! hover:bg-brand-pink-deep!`}
                  >
                    <IconTrash size={16} aria-hidden="true" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-line bg-brand-cream px-6 py-10 text-center">
            <BrandCharacter character="host" className="w-28" />
            <p className="mt-4 font-bold">Belum ada cerita</p>
            <p className="mt-1 max-w-sm text-sm text-brand-muted">
              Mulai dari pertama kali kalian bertemu, misalnya.
            </p>
          </div>
        )}
      </section>

      {/* Edit Dialog */}
      <Dialog
        open={isOpenEdit}
        onOpenChange={(open) => {
          if (!open) { setIsOpenEdit(false); setSelectedItem(null); resetForm(); }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Love Story</DialogTitle>
          </DialogHeader>
          {formFields}
          <div className="flex gap-2 mt-4">
            <Button
              className="bg-brand-green hover:bg-brand-green-dark"
              onClick={handleUpdate}
              disabled={isUpdating || !form.story.trim()}
            >
              {isUpdating ? (
                <><IconLoader2 className="animate-spin w-4 h-4" /><span>Menyimpan...</span></>
              ) : "Simpan"}
            </Button>
            <Button variant="outline" onClick={() => { setIsOpenEdit(false); setSelectedItem(null); resetForm(); }}>
              Batal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Love Story</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus cerita ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenDelete(false); setSelectedItem(null); }}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <><IconLoader2 className="w-4 h-4 animate-spin" /><span>Menghapus...</span></>
              ) : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
