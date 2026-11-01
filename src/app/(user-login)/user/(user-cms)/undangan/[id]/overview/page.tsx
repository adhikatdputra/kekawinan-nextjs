"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UndanganUcapan, Params } from "@/frontend/interface/undangan";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import { IconLoader2, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from "@/components/ui/custom/pagination";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import undanganUcapanApi from "@/frontend/api/undangan-ucapan";
import undanganApi from "@/frontend/api/undangan";
import UcapanStore from "@/frontend/store/ucapan-store";
import { debounce } from "lodash";

export default function OverviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { update, updateIsShow, remove } = UcapanStore();

  const { mutate: updateIsShowUcapan } = updateIsShow;
  const { mutate: updateUcapan, isPending: isPendingUpdate } = update;
  const { mutate: deleteUcapan, isPending: isPendingDelete } = remove;

  // Form Data
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState<UndanganUcapan[]>([]);
  const [selectedItem, setSelectedItem] = useState<UndanganUcapan | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

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
    data: undanganUcapan,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["undangan-ucapan", id],
    queryFn: () => undanganUcapanApi.getData(id, queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const {
    data: undanganOverview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["undangan-overview", id],
    queryFn: () => undanganApi.getUndanganOverview(id),
    select: (data) => data.data.data,
  });

  const handleDeleteUcapan = () => {
    deleteUcapan(selectedItem?.id as string, {
      onSuccess: () => {
        refetch();
        refetchOverview();
        setIsOpenDelete(false);
        setSelectedItem(null);
      },
    });
  };

  const handleUpdateIsShowUcapan = (item: UndanganUcapan) => {
    const getShow = !item.isShow;
    const isShow = getShow ? 1 : 0;

    updateIsShowUcapan(
      {
        id: item.id as string,
        data: { isShow: isShow },
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleUpdateUcapan = () => {
    updateUcapan(
      {
        id: selectedItem?.id as string,
        data: {
          message,
          name: selectedItem?.name as string,
        },
      },
      {
        onSuccess: () => {
          setIsOpenUpdate(false);
          setMessage("");
          setSelectedItem(null);
          refetch();
          refetchOverview();
        },
      }
    );
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
    if (undanganUcapan) {
      setTableData(undanganUcapan.rows);
    }
    setIsDataLoaded(true);
  }, [undanganUcapan]);

  useEffect(() => {
    return () => {
      debounceSetParamsTable.cancel();
    };
  }, []);

  const stats = [
    {
      label: "Total tamu undangan",
      hint: "Jumlah orang di daftar tamu",
      value: undanganOverview?.total_tamu,
      className: "bg-brand-green text-white",
      hintClassName: "text-white/80",
    },
    {
      label: "Akan hadir",
      hint: "Dari konfirmasi RSVP",
      value: undanganOverview?.total_tamu_hadir,
      className: "bg-brand-mint",
    },
    {
      label: "Tidak hadir",
      hint: "Dari konfirmasi RSVP",
      value: undanganOverview?.total_tamu_tidak_hadir,
      className: "bg-brand-pink",
    },
    {
      label: "Sudah hadir",
      hint: "Tercatat di hari acara",
      value: undanganOverview?.total_tamu_sudah_hadir,
      className: "bg-brand-sky",
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-brand-ink">
      <header className="relative overflow-hidden rounded-2xl bg-brand-mint p-6 sm:p-8 sm:pr-[200px]">
        <h1 className="font-recoleta-alt text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] font-bold tracking-[-0.02em]">
          Dashboard undangan
        </h1>
        <p className="mt-3 max-w-[560px] leading-[1.7] text-brand-muted">
          Pantau perkiraan tamu yang datang, lalu atur doa &amp; ucapan yang
          dikirim tamu lewat undangan.
        </p>
        <div
          className="absolute -bottom-2 right-6 hidden w-[150px] sm:block"
          aria-hidden="true"
        >
          <div className="absolute inset-x-[6%] top-[12%] bottom-0 rounded-[48%_48%_16px_16px] bg-brand-yellow" />
          <BrandCharacter character="host" className="relative w-full" />
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex min-h-[148px] flex-col rounded-2xl p-4 sm:p-5 ${stat.className}`}
          >
            <dt className="font-bold leading-snug">{stat.label}</dt>
            <dd className="mt-auto pt-4">
              <span className="flex items-baseline gap-1.5">
                <span className="font-recoleta-alt text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-bold">
                  {isLoadingOverview ? (
                    <IconLoader2 size={32} className="animate-spin" aria-label="Memuat" />
                  ) : (
                    stat.value || 0
                  )}
                </span>
                <span className="text-sm">tamu</span>
              </span>
              <span className={`mt-1 block text-[13px] ${stat.hintClassName ?? "text-brand-muted"}`}>
                {stat.hint}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="ucapan-heading" className="grid grid-cols-[minmax(0,1fr)] gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="ucapan-heading" className="font-recoleta-alt text-2xl font-bold">
              Doa &amp; ucapan
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-muted">
              {isLoading ? (
                <IconLoader2 size={14} className="animate-spin" aria-label="Memuat" />
              ) : (
                `${undanganUcapan?.total_data ?? 0} ucapan dari tamu`
              )}
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <label htmlFor="cari-ucapan" className="sr-only">
              Cari ucapan
            </label>
            <IconSearch
              size={18}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-brand-muted"
              aria-hidden="true"
            />
            <Input
              id="cari-ucapan"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau ucapan"
              className="h-11 rounded-xl border-brand-line bg-white pl-10 text-brand-ink focus-visible:border-brand-focus focus-visible:ring-brand-focus/30"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-line">
          <Table>
            <TableCaption className="sr-only">Doa dan ucapan dari tamu undangan</TableCaption>
            <TableHeader>
              <TableRow className="border-brand-line hover:bg-transparent">
                <TableHead className="w-[20%] pl-4 text-brand-muted">Nama tamu</TableHead>
                <TableHead className="w-[45%] text-brand-muted">Ucapan &amp; doa</TableHead>
                <TableHead className="w-[10%] text-brand-muted">Diundang</TableHead>
                <TableHead className="w-[15%] text-brand-muted">Kehadiran</TableHead>
                <TableHead className="w-[10%] pr-4 text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TablePending colSpan={5} />
              ) : tableData.length > 0 ? (
                tableData.map((item) => (
                  <TableRow key={item.id} className="border-brand-line hover:bg-brand-cream">
                    <TableCell className="w-[20%] pl-4 align-top font-bold">{item.name}</TableCell>
                    <TableCell className="w-[45%] align-top whitespace-break-spaces leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
                    </TableCell>
                    <TableCell className="w-[10%] align-top">
                      {item.maxInvite ? `${item.maxInvite} orang` : "-"}
                    </TableCell>
                    <TableCell className="w-[15%] align-top">
                      {item.attend == "Yes" ? (
                        <span className="inline-flex rounded-lg bg-brand-mint px-2.5 py-1 text-[13px] font-bold text-brand-green">
                          Hadir · {item.attendTotal} orang
                        </span>
                      ) : (
                        <span className="inline-flex rounded-lg bg-brand-pink px-2.5 py-1 text-[13px] font-bold text-brand-rose">
                          Tidak hadir
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="w-[10%] pr-4 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                handleUpdateIsShowUcapan(item);
                              }}
                              aria-pressed={!!item.isShow}
                              aria-label={
                                item.isShow
                                  ? `Sembunyikan ucapan dari ${item.name}`
                                  : `Tampilkan ucapan dari ${item.name}`
                              }
                              className={`${
                                item.isShow
                                  ? "border-brand-line bg-brand-mint text-brand-green"
                                  : "border-brand-pink-deep bg-brand-pink text-brand-rose"
                              } cursor-pointer rounded-md border p-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-focus`}
                            >
                              {item.isShow ? (
                                <IconEye size={18} aria-hidden="true" />
                              ) : (
                                <IconEyeOff size={18} aria-hidden="true" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.isShow
                                  ? "Tampil di undangan"
                                  : "Disembunyikan dari undangan"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <MenuAction
                          handleDelete={() => {
                            setIsOpenDelete(true);
                            setSelectedItem(item);
                          }}
                          handleEdit={() => {
                            setIsOpenUpdate(true);
                            setSelectedItem(item);
                            setMessage(item.message);
                          }}
                          items={["Hapus", "Edit"]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center whitespace-normal">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <BrandCharacter character="courier" className="w-28" />
                      {queryParams.search ? (
                        <>
                          <p className="mt-4 font-bold">Tidak ada ucapan yang cocok</p>
                          <p className="mt-1 text-sm text-brand-muted">
                            Coba kata lain atau kosongkan pencarian.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-4 font-bold">Belum ada ucapan</p>
                          <p className="mt-1 text-sm text-brand-muted">
                            Ucapan dan konfirmasi kehadiran dari tamu akan muncul di sini.
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!isLoading && (
            <div className="border-t border-brand-line p-4">
              <Pagination
                page={page}
                setPage={setPage}
                totalPage={undanganUcapan?.total_page}
                totalData={undanganUcapan?.total_data}
                pageSize={limit}
                setPageSize={setLimit}
                totalDataPerPage={tableData.length}
              />
            </div>
          )}
        </div>
      </section>

      <Dialog open={isOpenUpdate} onOpenChange={setIsOpenUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ucapan</DialogTitle>
            <DialogDescription>
              Edit ucapan dari{" "}
              <span className="font-bold">{selectedItem?.name}</span>
            </DialogDescription>
            <div className="flex flex-col gap-4 py-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpenUpdate(false)}>
                Batal
              </Button>
              <Button
                onClick={handleUpdateUcapan}
                disabled={isPendingUpdate}
                className="bg-brand-green hover:bg-brand-green-dark"
              >
                {isPendingUpdate ? (
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
              Hapus Ucapan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus ucapan dari{" "}
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
              onClick={handleDeleteUcapan}
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
