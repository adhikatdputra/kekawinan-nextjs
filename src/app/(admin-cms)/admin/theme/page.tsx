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
import AdminThemeStore from "@/frontend/store/admin-theme-store";
import { debounce } from "lodash";
import { IconPlus } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

export default function ThemeAdminPage() {
  const { update, create, remove } = AdminThemeStore();

  const { mutate: updateTheme, isPending: isPendingUpdate } = update;
  const { mutate: createTheme, isPending: isPendingCreate } = create;
  const { mutate: deleteTheme, isPending: isPendingDelete } = remove;

  // Form Data
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState<Theme[]>([]);
  const [selectedItem, setSelectedItem] = useState<Theme | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [componentName, setComponentName] = useState("");
  const [credit, setCredit] = useState(0);
  const [promo, setPromo] = useState(0);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [queryParams, setQueryParams] = useState<Params>({
    limit: limit,
    page: page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const {
    data: resultTable,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["theme-list-admin"],
    queryFn: () => themeApi.getAll(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const handleDelete = () => {
    deleteTheme(selectedItem?.id as string, {
      onSuccess: () => {
        refetch();
        setIsOpenDelete(false);
        setSelectedItem(null);
      },
    });
  };

  const setDataEdit = (item: Theme) => {
    setName(item.name);
    setThumbnail(item.thumbnail as unknown as File);
    setComponentName(item.component_name);
    setCredit(item.credit);
    setPromo(item.promo);
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("thumbnail", thumbnail as unknown as string);
    formData.append("component_name", componentName);
    formData.append("link_url", "#");
    formData.append("credit", credit.toString());
    formData.append("promo", promo.toString());
    createTheme(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedItem(null);
        refetch();
      },
    });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("thumbnail", thumbnail as unknown as string);
    formData.append("component_name", componentName);
    formData.append("link_url", "#");
    formData.append("credit", credit.toString());
    formData.append("promo", promo.toString());
    updateTheme(
      {
        id: selectedItem?.id as string,
        data: formData,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItem(null);
          refetch();
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setName("");
    setThumbnail(null);
    setComponentName("");
    setCredit(0);
    setPromo(0);
  };

  const debounceSetParamsTable = useRef(
    debounce((searchText: string) => {
      setPage(1);
      setQueryParams((prev) => ({
        ...prev,
        search: searchText,
        page: 1,
      }));
    }, 500)
  ).current;

  useEffect(() => {
    if (isDataLoaded) {
      debounceSetParamsTable(search);
    }
  }, [search]);

  useEffect(() => {
    refetch();
  }, [queryParams]);

  useEffect(() => {
    if (isDataLoaded) {
      setQueryParams((prev) => ({
        ...prev,
        page: page,
      }));
    }
  }, [page]);

  useEffect(() => {
    if (isDataLoaded) {
      setPage(1);
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        limit: limit,
      }));
    }
  }, [limit]);

  useEffect(() => {
    if (resultTable) {
      setTableData(resultTable.rows);
    }
    setIsDataLoaded(true);
  }, [resultTable]);

  useEffect(() => {
    return () => {
      debounceSetParamsTable.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Tema Undangan</h1>
        <p>Atur tema undangan yang akan digunakan oleh user</p>
      </div>
      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="grid grid-cols-1 items-center">
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setIsOpen(true);
                setSelectedItem(null);
              }}
            >
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
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Gambar</TableHead>
              <TableHead className="w-[30%]">Nama</TableHead>
              <TableHead className="w-[20%]">Component Name</TableHead>
              <TableHead className="w-[20%]">Harga</TableHead>
              <TableHead className="w-[15%]">Digunakan</TableHead>
              <TableHead className="text-right w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={5} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-[10%]">
                    <Image
                      src={item.thumbnail || ""}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md aspect-square object-cover"
                    />
                  </TableCell>
                  <TableCell className="w-[30%] whitespace-break-spaces">
                    {item.name}
                  </TableCell>
                  <TableCell className="w-[20%] whitespace-break-spaces">
                    {item.component_name}
                  </TableCell>
                  <TableCell className="w-[20%] whitespace-break-spaces">
                    {item.credit} Credits
                    {item.promo > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Promo: {item.promo} Credits
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-[15%] whitespace-break-spaces">
                    {item.undanganCount} Undangan
                  </TableCell>
                  <TableCell className="text-right w-[10%]">
                    <div className="flex gap-2 justify-end">
                      <MenuAction
                        handleDelete={() => {
                          setIsOpenDelete(true);
                          setSelectedItem(item);
                        }}
                        handleEdit={() => {
                          setIsOpen(true);
                          setDataEdit(item);
                        }}
                        items={["Hapus", "Edit"]}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={5} />
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

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          setSelectedItem(null);
          resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit" : "Tambah"} Tema</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nama Tema</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Component Name</Label>
                <Input
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Harga</Label>
                <Input
                  type="number"
                  value={credit}
                  onChange={(e) => setCredit(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Promo</Label>
                <Input
                  type="number"
                  value={promo}
                  onChange={(e) => setPromo(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gambar</Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="cursor-pointer bg-white"
                />
                <p className="text-xs text-muted-foreground">
                  Format file yang diizinkan: PNG, JPG, JPEG, GIF, dan WEBP.
                  Ukuran maksimal 1MB.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPendingUpdate || isPendingCreate}
              >
                {isPendingUpdate || isPendingCreate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Tema
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus tema{" "}
              <span className="font-bold">{selectedItem?.name}</span> ?
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
              onClick={handleDelete}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
