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
import TableNoData from "@/components/ui/custom/table-no-data";
import { IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
      },
    });
  };

  const handleUpdateIsShowUcapan = (item: UndanganUcapan) => {
    const getShow = !item.is_show;
    const isShow = getShow ? "1" : "0";

    updateIsShowUcapan(
      {
        id: item.id as string,
        data: { is_show: isShow },
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleUpdateUcapan = () => {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("name", selectedItem?.name as string);
    formData.append("undangan_id", id);
    updateUcapan(
      {
        id: selectedItem?.id as string,
        data: formData,
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Dashboard Undangan</h1>
        <p>
          Kamu dapat melihat perkiraan tamu yang akan hadir serta mengatur data
          Doa & Ucapan yang sudah diberikan tamu yang di undang
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">Total Tamu Undangan</h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingOverview ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  undanganOverview?.total_tamu || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">Akan Hadir</h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingOverview ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  undanganOverview?.total_tamu_hadir || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">Tidak Hadir</h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingOverview ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  undanganOverview?.total_tamu_tidak_hadir || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <div className="font-semibold flex items-center gap-2">
            Total:{" "}
            {isLoading ? (
              <IconLoader2 size={16} className="animate-spin pb-1" />
            ) : (
              undanganUcapan?.count
            )}{" "}
            Doa & Ucapan
          </div>
          <div className="flex gap-2 justify-end">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ucapan"
              className="max-w-xs"
            />
          </div>
        </div>
        <Table>
          <TableCaption>Ucapan dan Doa dari Tamu Undangan</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Nama Tamu</TableHead>
              <TableHead className="w-[55%]">Ucapan & Doa</TableHead>
              <TableHead className="w-[15%]">Kehadiran</TableHead>
              <TableHead className="text-right w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={4} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-[20%]">{item.name}</TableCell>
                  <TableCell className="w-[55%] whitespace-break-spaces">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    ></div>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <p>
                      {item.attend == "Yes" ? "Hadir" : "Tidak Hadir ❌"}{" "}
                      {item.attend == "Yes" && (
                        <span>- {item.attend_total} Orang</span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="text-right w-[10%]">
                    <div className="flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => {
                              handleUpdateIsShowUcapan(item);
                            }}
                            className={`${
                              item.is_show ? "bg-green-soft-kwn" : "bg-red-400"
                            } cursor-pointer border border-border rounded-md p-1 `}
                          >
                            {item.is_show ? (
                              <IconEye size={18} />
                            ) : (
                              <IconEyeOff size={18} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {item.is_show
                                ? "Ucapan ditampilkan"
                                : "Ucapan disembunyikan"}
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
              <TableNoData colSpan={4} />
            )}
          </TableBody>
        </Table>
        <Separator />
        {!isLoading && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={undanganUcapan?.total_page}
            totalData={undanganUcapan?.count}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

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
              <Button onClick={handleUpdateUcapan} disabled={isPendingUpdate}>
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
