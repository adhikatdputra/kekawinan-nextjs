"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { IconPlus, IconCode } from "@tabler/icons-react";
import toast from "react-hot-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import themeComponentsApi from "@/frontend/api/admin/theme-components";
import { formatDate } from "@/helper/date";

interface ThemeComponent {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function ThemeComponentsPage() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ThemeComponent | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["theme-components-admin"],
    queryFn: themeComponentsApi.getAll,
    select: (res) => res.data.data as ThemeComponent[],
  });

  const create = useMutation({
    mutationFn: themeComponentsApi.create,
    onSuccess: () => {
      toast.success("Component berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["theme-components-admin"] });
      queryClient.invalidateQueries({ queryKey: ["theme-components-select"] });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Gagal menambahkan component");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: string; name: string; description?: string }) =>
      themeComponentsApi.update(id, body),
    onSuccess: () => {
      toast.success("Component berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: ["theme-components-admin"] });
      queryClient.invalidateQueries({ queryKey: ["theme-components-select"] });
      setIsOpen(false);
      setSelectedItem(null);
      resetForm();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Gagal mengupdate component");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => themeComponentsApi.remove(id),
    onSuccess: () => {
      toast.success("Component berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["theme-components-admin"] });
      queryClient.invalidateQueries({ queryKey: ["theme-components-select"] });
      setIsOpenDelete(false);
      setSelectedItem(null);
    },
    onError: () => { toast.error("Gagal menghapus component"); },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const openCreate = () => {
    resetForm();
    setSelectedItem(null);
    setIsOpen(true);
  };

  const openEdit = (item: ThemeComponent) => {
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description ?? "");
    setIsOpen(true);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Nama component wajib diisi");
      return;
    }
    if (selectedItem) {
      update.mutate({ id: selectedItem.id, name: trimmedName, description: description.trim() || undefined });
    } else {
      create.mutate({ name: trimmedName, description: description.trim() || undefined });
    }
  };

  const isBusy = create.isPending || update.isPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Theme Components</h1>
        <p className="text-muted-foreground text-sm">
          Daftar nama component yang sudah tersedia di codebase. Pilih dari sini saat membuat tema baru.
        </p>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <IconCode size={18} className="mt-0.5 flex-shrink-0" />
        <span>
          Tambahkan component name di sini setelah developer selesai membuat kode themenya.
          Nama harus <strong>sama persis</strong> dengan nama component React yang sudah dibuat (case-sensitive).
          Contoh: <code className="bg-blue-100 px-1 rounded">Theme9</code>, <code className="bg-blue-100 px-1 rounded">ThemeMinimalist</code>
        </span>
      </div>

      <div className="border border-border p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex justify-end">
          <Button onClick={openCreate}>
            <IconPlus size={16} />
            Tambah Component
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component Name</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Ditambahkan</TableHead>
              <TableHead className="text-right w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={4} />
            ) : (data?.length ?? 0) > 0 ? (
              data!.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <code className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                      {item.name}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.description ?? <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <MenuAction
                      handleEdit={() => openEdit(item)}
                      handleDelete={() => { setSelectedItem(item); setIsOpenDelete(true); }}
                      items={["Edit", "Hapus"]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={4} />
            )}
          </TableBody>
        </Table>

        {!isLoading && (data?.length ?? 0) > 0 && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground">Total: {data?.length} component</p>
          </>
        )}
      </div>

      {/* Dialog Tambah / Edit */}
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { resetForm(); setSelectedItem(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit" : "Tambah"} Component</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label>Component Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Contoh: Theme9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Harus sama persis dengan nama component React. Hanya huruf, angka, underscore, dash.
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Keterangan <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Input
                placeholder="Contoh: Tema minimalis warna putih"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isBusy || !name.trim()}>
              {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></> : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Hapus */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Component</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus <code className="bg-muted px-1 rounded">{selectedItem?.name}</code> dari master data?
              Tema yang sudah menggunakan component ini tidak akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove.mutate(selectedItem!.id)} disabled={remove.isPending}>
              {remove.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
