"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Theme, Params } from "@/frontend/interface/undangan";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import toast from "react-hot-toast";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/ui/custom/pagination";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import themeApi from "@/frontend/api/admin/theme";
import uploadApi from "@/frontend/api/upload";
import AdminThemeStore from "@/frontend/store/admin-theme-store";
import { debounce } from "lodash";
import { IconPlus } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

export default function ThemeAdminPage() {
  const { update, create, remove } = AdminThemeStore();

  const { mutate: updateTheme, isPending: isPendingUpdate } = update;
  const { mutate: createTheme, isPending: isPendingCreate } = create;
  const { mutate: deleteTheme, isPending: isPendingDelete } = remove;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState<Theme[]>([]);
  const [selectedItem, setSelectedItem] = useState<Theme | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [componentName, setComponentName] = useState("");
  const [creditStr, setCreditStr] = useState("0");
  const [promoStr, setPromoStr] = useState(""); // empty = no promo, "0" = free
  const [isActive, setIsActive] = useState(true);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [queryParams, setQueryParams] = useState<Params>({
    limit,
    page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const { data: resultTable, isLoading, refetch } = useQuery({
    queryKey: ["theme-list-admin"],
    queryFn: () => themeApi.getAll(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const resetForm = () => {
    setName("");
    setThumbnailFile(null);
    setThumbnailUrl("");
    setComponentName("");
    setCreditStr("0");
    setPromoStr("");
    setIsActive(true);
  };

  const setDataEdit = (item: Theme) => {
    setName(item.name ?? "");
    setThumbnailFile(null);
    setThumbnailUrl(item.thumbnail || "");
    setComponentName(item.componentName ?? "");
    setCreditStr(String(item.credit ?? 0));
    setPromoStr(item.promo !== null && item.promo !== undefined ? String(item.promo) : "");
    setIsActive(item.isActive ?? true);
    setSelectedItem(item);
  };

  const handleDelete = () => {
    deleteTheme(selectedItem?.id as string, {
      onSuccess: () => {
        refetch();
        setIsOpenDelete(false);
        setSelectedItem(null);
      },
    });
  };

  const handleSubmit = async () => {
    if (!name || !componentName) {
      toast.error("Nama dan Component Name wajib diisi");
      return;
    }

    setIsUploading(true);
    let thumbUrl = thumbnailUrl;
    if (thumbnailFile) {
      try {
        const res = await uploadApi.uploadImage(thumbnailFile, "kekawinan/themes");
        thumbUrl = res.data.data.url;
      } catch {
        toast.error("Gagal upload gambar");
        setIsUploading(false);
        return;
      }
    }
    setIsUploading(false);

    const payload = {
      name,
      componentName,
      linkUrl: "#",
      thumbnail: thumbUrl || null,
      credit: Number(creditStr) || 0,
      promo: promoStr === "" ? null : Number(promoStr),
      isActive,
    };

    if (selectedItem) {
      updateTheme(
        { id: selectedItem.id, data: payload },
        {
          onSuccess: () => {
            setIsOpen(false);
            setSelectedItem(null);
            refetch();
            resetForm();
          },
        }
      );
    } else {
      createTheme(payload, {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItem(null);
          refetch();
          resetForm();
        },
      });
    }
  };

  const debounceSetParamsTable = useRef(
    debounce((searchText: string) => {
      setPage(1);
      setQueryParams((prev) => ({ ...prev, search: searchText, page: 1 }));
    }, 500)
  ).current;

  useEffect(() => {
    if (isDataLoaded) debounceSetParamsTable(search);
  }, [search]);

  useEffect(() => { refetch(); }, [queryParams]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page }));
  }, [page]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page: 1, limit }));
  }, [limit]);

  useEffect(() => {
    if (resultTable) setTableData(resultTable.rows);
    setIsDataLoaded(true);
  }, [resultTable]);

  useEffect(() => () => debounceSetParamsTable.cancel(), []);

  const isBusy = isPendingUpdate || isPendingCreate || isUploading;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Tema Undangan</h1>
        <p>Atur tema undangan yang akan digunakan oleh user</p>
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end">
          <Button onClick={() => { resetForm(); setSelectedItem(null); setIsOpen(true); }}>
            <IconPlus size={16} />
            Tambah Tema
          </Button>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tema undangan"
            className="max-w-xs"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[8%]">Gambar</TableHead>
              <TableHead className="w-[22%]">Nama</TableHead>
              <TableHead className="w-[18%]">Component Name</TableHead>
              <TableHead className="w-[14%]">Harga (credit)</TableHead>
              <TableHead className="w-[14%]">Promo</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Digunakan</TableHead>
              <TableHead className="text-right w-[4%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={8} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name ?? ""}
                        width={64}
                        height={64}
                        className="rounded-md aspect-square object-cover w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.componentName}</TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">{item.credit}</span>
                    <span className="text-xs text-muted-foreground ml-1">credit</span>
                  </TableCell>
                  <TableCell>
                    {item.promo === null || item.promo === undefined ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : item.promo === 0 ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">GRATIS</span>
                    ) : (
                      <span className="text-sm font-semibold text-red-600">{item.promo} <span className="text-xs font-normal">credit</span></span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{item._count?.undangan ?? 0} undangan</TableCell>
                  <TableCell className="text-right">
                    <MenuAction
                      handleDelete={() => { setIsOpenDelete(true); setSelectedItem(item); }}
                      handleEdit={() => { setDataEdit(item); setIsOpen(true); }}
                      items={["Hapus", "Edit"]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={8} />
            )}
          </TableBody>
        </Table>

        <Separator />
        {!isLoading && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={resultTable?.total_page}
            totalData={resultTable?.count}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

      {/* Dialog Tambah / Edit */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) { setSelectedItem(null); resetForm(); }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit" : "Tambah"} Tema</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label>Nama Tema <span className="text-red-500">*</span></Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Component Name <span className="text-red-500">*</span></Label>
              <Input value={componentName} onChange={(e) => setComponentName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Harga <span className="text-xs text-muted-foreground">(credit)</span></Label>
              <Input
                type="number"
                min={0}
                value={creditStr}
                onChange={(e) => setCreditStr(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Jumlah credit yang dibutuhkan untuk menggunakan tema ini.</p>
            </div>

            <div className="grid gap-2">
              <Label>Promo <span className="text-xs text-muted-foreground">(opsional, dalam credit)</span></Label>
              <Input
                type="number"
                min={0}
                placeholder="Kosongkan jika tidak ada promo"
                value={promoStr}
                onChange={(e) => setPromoStr(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Kosongkan = tidak ada promo. Isi <strong>0</strong> = tema gratis saat promo.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Gambar Thumbnail</Label>
              {thumbnailUrl && !thumbnailFile && (
                <Image
                  src={thumbnailUrl}
                  alt="thumbnail"
                  width={120}
                  height={120}
                  className="rounded-md object-cover w-20 h-20"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="cursor-pointer bg-white"
              />
              <p className="text-xs text-muted-foreground">
                Format: PNG, JPG, JPEG, GIF, WEBP. Maks 1 MB.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setIsActive(!!v)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">Tema aktif (tampil ke user)</Label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isBusy}>
              {isBusy ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{isUploading ? "Mengupload..." : "Menyimpan..."}</span></>
              ) : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Hapus */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Hapus Tema</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-black font-normal">
              Apakah kamu yakin ingin menghapus tema{" "}
              <span className="font-bold">{selectedItem?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenDelete(false); setSelectedItem(null); }}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPendingDelete}>
              {isPendingDelete ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Menghapus...</span></>
              ) : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
