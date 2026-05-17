"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import loveStoryApi from "@/frontend/api/undangan-love-story";
import uploadApi from "@/frontend/api/upload";
import { LoveStory } from "@/frontend/interface/undangan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Image from "next/image";
import toast from "react-hot-toast";
import { IconChevronUp, IconChevronDown, IconLoader2 } from "@tabler/icons-react";

const EMPTY_FORM = { waktu: "", lokasi: "", story: "" };

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
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>
          Foto <span className="text-muted-foreground text-xs">(opsional)</span>
        </Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer bg-white border-white"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={400}
            height={300}
            className="w-[120px] object-cover rounded-md"
          />
        )}
        <p className="text-xs text-muted-foreground">
          Format: PNG, JPG, JPEG, WEBP. Maks 1MB.
        </p>
      </div>
      <div className="grid gap-2">
        <Label>
          Waktu <span className="text-muted-foreground text-xs">(opsional)</span>
        </Label>
        <Input
          placeholder="contoh: Juni 2019, Tahun 2020..."
          value={form.waktu}
          onChange={(e) => setForm((f) => ({ ...f, waktu: e.target.value }))}
          className="bg-white"
        />
      </div>
      <div className="grid gap-2">
        <Label>
          Lokasi <span className="text-muted-foreground text-xs">(opsional)</span>
        </Label>
        <Input
          placeholder="contoh: Bandung, Jakarta..."
          value={form.lokasi}
          onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
          className="bg-white"
        />
      </div>
      <div className="grid gap-2">
        <Label>
          Story <span className="text-red-500">*</span>
        </Label>
        <Textarea
          placeholder="Ceritakan momen ini..."
          rows={4}
          value={form.story}
          onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
          className="bg-white"
        />
      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Love Story</h1>
        <p>
          Ceritakan perjalanan cinta kalian — momen-momen yang tak terlupakan
          sebelum hari bahagia.
        </p>
      </div>

      {!isOpenCreate && (
        <div>
          <Button onClick={() => { resetForm(); setIsOpenCreate(true); }}>
            + Tambah Cerita
          </Button>
        </div>
      )}

      {isOpenCreate && (
        <div className="bg-green-soft-kwn p-4 rounded-md">
          <h2 className="font-semibold mb-4">Tambah Cerita Baru</h2>
          {formFields}
          <div className="flex gap-2 mt-4">
            <Button onClick={handleCreate} disabled={isCreating || !form.story.trim()}>
              {isCreating ? (
                <><IconLoader2 className="animate-spin w-4 h-4" /><span>Menyimpan...</span></>
              ) : "Simpan"}
            </Button>
            <Button variant="outline" onClick={() => { setIsOpenCreate(false); resetForm(); }}>
              Batal
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Waktu &amp; Lokasi</TableHead>
            <TableHead>Story</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TablePending colSpan={4} />
          ) : tableData.length > 0 ? (
            tableData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt="foto"
                      width={120}
                      height={80}
                      className="w-[100px] rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">–</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-sm">
                    {item.waktu && <span className="font-medium">{item.waktu}</span>}
                    {item.lokasi && <span className="text-muted-foreground">{item.lokasi}</span>}
                    {!item.waktu && !item.lokasi && <span className="text-muted-foreground">–</span>}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="line-clamp-3 text-sm">{item.story}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end items-center">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveUp(item.id)}
                        className="h-7 w-7 bg-green-kwn text-white rounded-md"
                      >
                        <IconChevronUp />
                      </Button>
                    )}
                    {index < tableData.length - 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveDown(item.id)}
                        className="h-7 w-7 bg-blue-600 text-white rounded-md"
                      >
                        <IconChevronDown />
                      </Button>
                    )}
                    <MenuAction
                      handleEdit={() => openEdit(item)}
                      handleDelete={() => { setSelectedItem(item); setIsOpenDelete(true); }}
                      items={["Edit", "Hapus"]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableNoData colSpan={4} />
          )}
        </TableBody>
      </Table>

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
            <Button onClick={handleUpdate} disabled={isUpdating || !form.story.trim()}>
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
