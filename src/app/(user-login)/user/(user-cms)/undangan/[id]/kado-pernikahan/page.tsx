"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Gift, Params } from "@/frontend/interface/undangan";
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
  TableCaption,
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
import giftApi from "@/frontend/api/gift";
import GiftStore from "@/frontend/store/gift-store";
import { debounce } from "lodash";
import { formatNumber } from "@/helper/number";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

export default function KadoPernikahanPage() {
  const params = useParams();
  const id = params.id as string;
  const { update, create, remove } = GiftStore();

  const { mutate: updateGift, isPending: isPendingUpdate } = update;
  const { mutate: createGift, isPending: isPendingCreate } = create;
  const { mutate: deleteGift, isPending: isPendingDelete } = remove;

  // Form Data
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState<Gift[]>([]);
  const [selectedItem, setSelectedItem] = useState<Gift | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [linkProduct, setLinkProduct] = useState("");

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
    queryKey: ["undangan-gift-list", id],
    queryFn: () => giftApi.getData(id, queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const handleDelete = () => {
    deleteGift(selectedItem?.id as string, {
      onSuccess: () => {
        refetch();
        setIsOpenDelete(false);
        setSelectedItem(null);
      },
    });
  };

  const setDataEdit = (item: Gift) => {
    setTitle(item.title);
    setPrice(item.price);
    setThumbnail(item.thumbnail as unknown as File);
    setLinkProduct(item.link_product);
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
    formData.append("undangan_id", id);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail as unknown as string);
    formData.append("description", " ");
    formData.append("link_product", linkProduct);
    createGift(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedItem(null);
        refetch();
      },
    });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("undangan_id", id);
    formData.append("title", title as string);
    formData.append("price", price as string);
    formData.append("thumbnail", thumbnail as unknown as string);
    formData.append("link_product", linkProduct as string);
    updateGift(
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
    setTitle("");
    setPrice("");
    setThumbnail(null);
    setLinkProduct("");
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
        <h1 className="text-2xl font-bold">Kado Pernikahan</h1>
        <p>
          Kamu dapat mengatur dan melihat kado yang sudah diberikan tamu yang di
          undang
        </p>
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
              Tambah Kado
            </Button>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kado pernikahan"
              className="max-w-xs"
            />
          </div>
        </div>
        <Table>
          <TableCaption>Kado Pernikahan</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Gambar</TableHead>
              <TableHead className="w-[25%]">Nama Kado</TableHead>
              <TableHead className="w-[20%]">Harga</TableHead>
              <TableHead className="w-[20%]">Link</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
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
                      alt={item.title}
                      width={100}
                      height={100}
                      className="rounded-md aspect-square object-cover"
                    />
                  </TableCell>
                  <TableCell className="w-[25%] whitespace-break-spaces">
                    {item.title}
                  </TableCell>
                  <TableCell className="w-[20%] whitespace-break-spaces">
                    {formatNumber(Number(item.price))}
                  </TableCell>
                  <TableCell className="w-[20%] whitespace-break-spaces">
                    <Link href={item.link_product} target="_blank" className="text-green-kwn underline">
                      Lihat Kado
                    </Link>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <p>
                      {item.is_confirm
                        ? "Dihadiahkan oleh"
                        : "Belum"}
                    </p>
                    {item.is_confirm ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.phone}
                        </p>
                      </>
                    ) : (
                      <div></div>
                    )}
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

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        setSelectedItem(null);
        resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit" : "Tambah"} Kado</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nama Kado</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Harga</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Link Kado</Label>
                <Input
                  value={linkProduct}
                  onChange={(e) => setLinkProduct(e.target.value)}
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
              <Button variant="outline" onClick={() => {
                setIsOpen(false);
                resetForm();
              }}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isPendingUpdate || isPendingCreate}>
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
              Hapus Kado
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus kado {" "}
              <span className="font-bold">{selectedItem?.title}</span> ?
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
