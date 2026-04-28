"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { Loader2 } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";

import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Pagination from "@/components/ui/custom/pagination";
import MenuAction from "@/components/ui/custom/menu-action";
import { formatDate } from "@/helper/date";

import { Params } from "@/frontend/interface/undangan";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { debounce } from "lodash";
import bankApi from "@/frontend/api/admin/bank";
import uploadApi from "@/frontend/api/upload";
import AdminBankStore from "@/frontend/store/admin-bank-store";
import toast from "react-hot-toast";

interface Bank {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  color: string | null;
  createdAt: string;
}


export default function BankPage() {
  const { create, update, remove } = AdminBankStore();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<Bank[]>([]);

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formColor, setFormColor] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [queryParams, setQueryParams] = useState<Params>({
    limit,
    page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const {
    data: responseTable,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["banks-admin", queryParams],
    queryFn: () => bankApi.getAll(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const debounceSearch = useRef(
    debounce((val: string) => {
      setPage(1);
      setQueryParams((prev) => ({ ...prev, search: val, page: 1 }));
    }, 500)
  ).current;

  useEffect(() => { if (isDataLoaded) debounceSearch(search); }, [search]);
  useEffect(() => { refetch(); }, [queryParams]);
  useEffect(() => { if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page })); }, [page]);
  useEffect(() => { if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page: 1, limit })); }, [limit]);
  useEffect(() => {
    if (responseTable) setTableData(responseTable.rows);
    setIsDataLoaded(true);
  }, [responseTable]);
  useEffect(() => () => debounceSearch.cancel(), []);

  const resetForm = () => {
    setFormName("");
    setFormCode("");
    setFormColor("");
    setIconFile(null);
    setIconPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const uploadIconIfNeeded = async (): Promise<string | undefined> => {
    if (!iconFile) return undefined;
    setIsUploading(true);
    try {
      const res = await uploadApi.uploadImage(iconFile, "kekawinan/bank");
      return res.data.data.url as string;
    } catch {
      toast.error("Gagal upload icon bank");
      throw new Error("upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setFormName(bank.name);
    setFormCode(bank.code);
    setFormColor(bank.color ?? "");
    setIconFile(null);
    setIconPreview(bank.icon ?? "");
    setIsOpenEdit(true);
  };

  const handleCreate = async () => {
    try {
      const iconUrl = await uploadIconIfNeeded();
      create.mutate(
        {
          name: formName,
          code: formCode,
          icon: iconUrl,
          color: formColor || undefined,
        },
        {
          onSuccess: (res) => {
            if (res.data.success) {
              setIsOpenCreate(false);
              resetForm();
              refetch();
            }
          },
        }
      );
    } catch {
      // upload error already toasted
    }
  };

  const handleUpdate = async () => {
    if (!selectedBank) return;
    try {
      const iconUrl = iconFile ? await uploadIconIfNeeded() : undefined;
      update.mutate(
        {
          id: selectedBank.id,
          data: {
            name: formName,
            code: formCode,
            color: formColor || undefined,
            ...(iconUrl !== undefined && { icon: iconUrl }),
          },
        },
        {
          onSuccess: (res) => {
            if (res.data.success) {
              setIsOpenEdit(false);
              setSelectedBank(null);
              resetForm();
              refetch();
            }
          },
        }
      );
    } catch {
      // upload error already toasted
    }
  };

  const handleDelete = () => {
    if (!selectedBank) return;
    remove.mutate(selectedBank.id, {
      onSuccess: (res) => {
        if (res.data.success) {
          setIsOpenDelete(false);
          setSelectedBank(null);
          refetch();
        }
      },
    });
  };

  const isBusy = isUploading || create.isPending || update.isPending;

  const formFields = (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>Nama Bank <span className="text-red-500">*</span></Label>
        <Input
          placeholder="Contoh: Bank Central Asia"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Kode Bank <span className="text-red-500">*</span></Label>
        <Input
          placeholder="Contoh: BCA"
          value={formCode}
          onChange={(e) => setFormCode(e.target.value.toUpperCase())}
          className="uppercase"
        />
      </div>
      <div className="grid gap-2">
        <Label>Icon Bank <span className="text-muted-foreground text-xs">(opsional)</span></Label>
        <div className="flex items-center gap-3">
          {iconPreview && (
            <div className="relative w-12 h-12 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-muted">
              <Image
                src={iconPreview}
                alt="Icon preview"
                fill
                className="object-contain p-1"
              />
            </div>
          )}
          <div className="flex-1 grid gap-1">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleIconChange}
              className="cursor-pointer bg-white"
            />
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP, SVG. Maks 1MB. Disarankan rasio 1:1.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>
          Warna <span className="text-muted-foreground text-xs">(opsional, nama warna Tailwind)</span>
        </Label>
        <Input
          placeholder="Contoh: blue, green, rose..."
          value={formColor}
          onChange={(e) => setFormColor(e.target.value.toLowerCase())}
        />
        <p className="text-xs text-muted-foreground">
          Digunakan sebagai base warna Tailwind, misal <code>blue</code> → <code>blue-100</code>, <code>blue-500</code>, dst.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Master Data Bank</h1>
        <p>Kelola daftar bank yang tersedia untuk nomor rekening.</p>
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end items-center">
          <Button onClick={() => { resetForm(); setIsOpenCreate(true); }}>
            <IconPlus size={16} />
            Tambah Bank
          </Button>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari bank..."
            className="max-w-xs"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Nama Bank</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Ditambahkan</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={6} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.icon ? (
                      <div className="relative w-8 h-8 rounded border border-border overflow-hidden bg-muted">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.color ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-${item.color}-600`} />
                        <span className="text-xs">{item.color}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <MenuAction
                      items={[]}
                      slotItem={
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start rounded-none w-full hover:bg-green-soft-kwn text-sm"
                            onClick={() => openEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start rounded-none w-full hover:bg-red-100 hover:text-red-700 text-sm"
                            onClick={() => {
                              setSelectedBank(item);
                              setIsOpenDelete(true);
                            }}
                          >
                            Hapus
                          </Button>
                        </>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={6} />
            )}
          </TableBody>
        </Table>

        <Separator />
        {!isLoading && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={responseTable?.total_page}
            totalData={responseTable?.count}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

      {/* Dialog: Tambah Bank */}
      <Dialog
        open={isOpenCreate}
        onOpenChange={(open) => {
          setIsOpenCreate(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Bank</DialogTitle>
            <DialogDescription>Tambah data bank baru ke master data.</DialogDescription>
          </DialogHeader>
          {formFields}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => { setIsOpenCreate(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleCreate} disabled={isBusy || !formName || !formCode}>
              {isBusy ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{isUploading ? "Mengupload..." : "Menyimpan..."}</span></>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Bank */}
      <Dialog
        open={isOpenEdit}
        onOpenChange={(open) => {
          setIsOpenEdit(open);
          if (!open) { setSelectedBank(null); resetForm(); }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank</DialogTitle>
            <DialogDescription>
              Update data bank <span className="font-semibold">{selectedBank?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => { setIsOpenEdit(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={isBusy || !formName || !formCode}>
              {isBusy ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{isUploading ? "Mengupload..." : "Menyimpan..."}</span></>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Hapus Bank */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Bank</AlertDialogTitle>
            <AlertDialogDescription>
              Bank <span className="font-semibold">{selectedBank?.name}</span> akan dihapus secara permanen.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenDelete(false); setSelectedBank(null); }}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={remove.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {remove.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Menghapus...</span></>
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
