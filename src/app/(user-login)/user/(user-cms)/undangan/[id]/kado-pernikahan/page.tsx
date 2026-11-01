"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Gift, Params } from "@/frontend/interface/undangan";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/ui/custom/pagination";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import giftApi from "@/frontend/api/gift";
import uploadApi from "@/frontend/api/upload";
import GiftStore from "@/frontend/store/gift-store";
import { debounce } from "lodash";
import { formatNumber } from "@/helper/number";
import Link from "next/link";
import {
  IconPlus,
  IconSearch,
  IconLoader2,
  IconGift,
  IconEdit,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  CmsPageHeader,
  CmsField,
  cmsFocusRing,
  cmsInput,
  cmsFileInput,
  cmsPrimaryButton,
  cmsSecondaryButton,
} from "@/components/pages/undangan/cms-ui";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

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
    deleteGift({ undanganId: id, id: selectedItem?.id as string }, {
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
    setLinkProduct(item.linkProduct);
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    let thumbnailUrl: string | undefined;
    if (thumbnail instanceof File) {
      try {
        const res = await uploadApi.uploadImage(thumbnail, "kekawinan/kado");
        thumbnailUrl = res.data.data.url;
      } catch {
        toast.error("Gagal mengupload gambar");
        return;
      }
    }
    createGift({ undanganId: id, data: { title, price, linkProduct, description: " ", thumbnail: thumbnailUrl } }, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedItem(null);
        refetch();
        resetForm();
      },
    });
  };

  const handleUpdate = async () => {
    let thumbnailUrl: string | undefined;
    if (thumbnail instanceof File) {
      try {
        const res = await uploadApi.uploadImage(thumbnail, "kekawinan/kado");
        thumbnailUrl = res.data.data.url;
      } catch {
        toast.error("Gagal mengupload gambar");
        return;
      }
    }
    updateGift(
      {
        undanganId: id,
        id: selectedItem?.id as string,
        data: { title, price, linkProduct, ...(thumbnailUrl && { thumbnail: thumbnailUrl }) },
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

  const iconAction = `grid size-10 cursor-pointer place-items-center rounded-lg transition-colors ${cmsFocusRing} focus-visible:outline-offset-2`;

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Kado pernikahan"
        description="Daftar kado yang kalian inginkan. Tamu bisa memilih satu, lalu kalian bisa lihat siapa yang menghadiahkannya."
      />

      <section aria-labelledby="kado-heading" className="grid grid-cols-[minmax(0,1fr)] gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="kado-heading" className="font-bold">Wishlist kado</h2>
            <p className="mt-1 text-sm text-brand-muted">
              {isLoading ? "Memuat…" : `${resultTable?.count ?? 0} kado`}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
              <label htmlFor="cari-kado" className="sr-only">Cari kado</label>
              <IconSearch
                size={18}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-brand-muted"
                aria-hidden="true"
              />
              <Input
                id="cari-kado"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kado"
                className={`${cmsInput} pl-10`}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setSelectedItem(null);
                setIsOpen(true);
              }}
              className={cmsPrimaryButton}
            >
              <IconPlus size={18} aria-hidden="true" />
              Tambah kado
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-brand-cream p-10 text-brand-muted">
            <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
            Memuat kado…
          </div>
        ) : tableData.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-3">
            {tableData.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-2xl border border-brand-line bg-brand-cream p-3">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt=""
                    width={200}
                    height={200}
                    className="size-24 shrink-0 rounded-xl bg-white object-cover"
                  />
                ) : (
                  <div className="grid size-24 shrink-0 place-items-center rounded-xl bg-brand-mint text-brand-leaf">
                    <IconGift size={28} aria-hidden="true" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-2 font-bold leading-snug">{item.title}</p>
                  <p className="mt-0.5 text-sm text-brand-muted tabular-nums">
                    Rp {formatNumber(Number(item.price))}
                  </p>
                  <div className="mt-2">
                    {item.isConfirm ? (
                      <span className="inline-flex flex-wrap gap-x-1 rounded-lg bg-brand-mint px-2.5 py-1 text-xs font-bold text-brand-green">
                        Dihadiahkan oleh {item.name}
                        {item.phone && <span className="font-normal">· {item.phone}</span>}
                      </span>
                    ) : (
                      <span className="inline-flex rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-brand-muted ring-1 ring-brand-line">
                        Belum dipilih tamu
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <Link
                      href={item.linkProduct}
                      target="_blank"
                      className={`inline-flex items-center gap-1 text-sm font-bold text-brand-green underline underline-offset-4 ${cmsFocusRing}`}
                    >
                      Lihat produk
                      <IconExternalLink size={14} aria-hidden="true" />
                      <span className="sr-only">(tab baru)</span>
                    </Link>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => {
                          setDataEdit(item);
                          setIsOpen(true);
                        }}
                        aria-label={`Edit ${item.title}`}
                        className={`${iconAction} hover:bg-brand-mint`}
                      >
                        <IconEdit size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpenDelete(true);
                          setSelectedItem(item);
                        }}
                        aria-label={`Hapus ${item.title}`}
                        className={`${iconAction} text-brand-rose hover:bg-brand-pink`}
                      >
                        <IconTrash size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-line bg-brand-cream px-6 py-10 text-center">
            <BrandCharacter character="gift" className="w-28" />
            {queryParams.search ? (
              <>
                <p className="mt-4 font-bold">Tidak ada kado yang cocok</p>
                <p className="mt-1 max-w-sm text-sm text-brand-muted">Coba kata lain atau kosongkan pencarian.</p>
              </>
            ) : (
              <>
                <p className="mt-4 font-bold">Belum ada kado</p>
                <p className="mt-1 max-w-sm text-sm text-brand-muted">
                  Tambahkan barang yang kalian butuhkan, lengkap dengan link tokonya.
                </p>
              </>
            )}
          </div>
        )}

        {!isLoading && tableData.length > 0 && (
          <div className="border-t border-brand-line pt-4">
            <Pagination
              page={page}
              setPage={setPage}
              totalPage={resultTable?.total_page}
              totalData={resultTable?.count}
              pageSize={limit}
              setPageSize={setLimit}
              totalDataPerPage={tableData.length}
            />
          </div>
        )}
      </section>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        setSelectedItem(null);
        resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit kado" : "Tambah kado"}</DialogTitle>
            <DialogDescription>Tamu akan diarahkan ke link produk untuk membelinya.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-2">
            <CmsField label="Nama kado" htmlFor="gift-title">
              <Input
                id="gift-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cmsInput}
              />
            </CmsField>
            <CmsField label="Harga (Rp)" htmlFor="gift-price">
              <Input
                id="gift-price"
                type="number"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={cmsInput}
              />
            </CmsField>
            <CmsField label="Link produk" htmlFor="gift-link">
              <Input
                id="gift-link"
                type="url"
                placeholder="https://"
                value={linkProduct}
                onChange={(e) => setLinkProduct(e.target.value)}
                className={cmsInput}
              />
            </CmsField>
            <CmsField label="Gambar" htmlFor="gift-image" hint="PNG, JPG, JPEG, GIF, atau WEBP. Maksimal 1MB.">
              <input
                type="file"
                id="gift-image"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className={cmsFileInput}
              />
            </CmsField>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className={cmsSecondaryButton}
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Batal
            </button>
            <button
              type="button"
              className={cmsPrimaryButton}
              onClick={handleSubmit}
              disabled={isPendingUpdate || isPendingCreate}
            >
              {isPendingUpdate || isPendingCreate ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
                  Menyimpan…
                </>
              ) : (
                "Simpan kado"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus kado
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
