"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Params, UndanganTamu } from "@/frontend/interface/undangan";
import {
  IconSend2,
  IconPlus,
  IconBrandWhatsapp,
  IconQrcode,
  IconDownload,
  IconFileSpreadsheet,
  IconTrash,
  IconCopy,
} from "@tabler/icons-react";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import { IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { QRCodeCanvas } from "qrcode.react";
import { BASE_URL } from "@/lib/config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Checkbox } from "@/components/ui/checkbox";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconChevronDown } from "@tabler/icons-react";
import Pagination from "@/components/ui/custom/pagination";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import TamuStore from "@/frontend/store/tamu-store";
import { debounce } from "lodash";
import undanganTamuApi from "@/frontend/api/undangan-tamu";
import undanganApi from "@/frontend/api/undangan";
import tamuBulkApi from "@/frontend/api/tamu-bulk";
import toast from "react-hot-toast";

export default function TamuPage() {
  const params = useParams();
  const id = params.id as string;
  const { update, create, remove, sendWhatsapp } = TamuStore();

  const { mutate: updateTamu, isPending: isPendingUpdate } = update;
  const { mutate: createTamu, isPending: isPendingCreate } = create;
  const { mutate: deleteTamu, isPending: isPendingDelete } = remove;
  const { mutate: sendWhatsappTamu } = sendWhatsapp;

  // Form Data
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [max_invite, setMaxInvite] = useState("");
  const [tableData, setTableData] = useState<UndanganTamu[]>([]);
  const [selectedItem, setSelectedItem] = useState<UndanganTamu | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrTamu, setQrTamu] = useState<UndanganTamu | null>(null);
  const [detailItem, setDetailItem] = useState<UndanganTamu | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Bulk import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success_count: number;
    failed_count: number;
    batch_id: string;
    total: number;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filterSendStatus, setFilterSendStatus] = useState("");
  const [filterIsRead, setFilterIsRead] = useState("");
  const [filterIsConfirm, setFilterIsConfirm] = useState("");
  const [filterIsAttend, setFilterIsAttend] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isOpenBulkDelete, setIsOpenBulkDelete] = useState(false);
  const [isDownloadingSelectedQR, setIsDownloadingSelectedQR] = useState(false);

  const [queryParams, setQueryParams] = useState<Params>({
    limit: limit,
    page: page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const { data: undangan } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data,
  });

  const {
    data: undanganTamu,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["undangan-tamu", id],
    queryFn: () => undanganTamuApi.getData(id, queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const {
    data: totalKirimWA,
    isLoading: isLoadingTotalKirimWA,
    refetch: refetchTotalKirimWA,
  } = useQuery({
    queryKey: ["total-tamu", id],
    queryFn: () => undanganTamuApi.getStats(id),
    select: (data) => data.data.data,
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

  const handleDeleteTamu = () => {
    deleteTamu(selectedItem?.id as string, {
      onSuccess: (data) => {
        const res = data.data;
        if (res.success) {
          refetch();
          refetchTotalKirimWA();
        }
      },
    });
  };

  const changeNoPhone = (phone: string) => {
    if (phone.startsWith("0")) {
      return phone.replace("0", "+62");
    }
    if (phone.startsWith("62")) {
      return phone.replace("62", "+62");
    }
    if (phone.startsWith("+620")) {
      return phone.replace("+620", "+62");
    }
    return phone;
  };

  const handleCreateTamu = () => {
    createTamu(
      {
        undanganId: id,
        name,
        phone: changeNoPhone(phone),
        maxInvite: max_invite,
      },
      {
        onSuccess: (data) => {
          const res = data.data;
          if (res.success) {
            setIsOpen(false);
            setName("");
            setPhone("");
            setMaxInvite("");
            setSelectedItem(null);
            refetch();
            refetchTotalKirimWA();
            refetchOverview();
          }
        },
      },
    );
  };

  const handleUpdateTamu = () => {
    updateTamu(
      {
        id: selectedItem?.id as string,
        data: {
          name,
          phone: changeNoPhone(phone),
          maxInvite: max_invite,
          sendStatus: 0,
        },
      },
      {
        onSuccess: (data) => {
          const res = data.data;
          if (res.success) {
            setIsOpen(false);
            setName("");
            setPhone("");
            setMaxInvite("");
            setSelectedItem(null);
            refetch();
            refetchTotalKirimWA();
            refetchOverview();
          }
        },
      },
    );
  };

  const handleSendWhatsapp = (item: UndanganTamu) => {
    const phone = item.phone;

    const name = item.name;
    const tamu = name.replace("&", "dan");

    const title = undangan?.content?.title;
    const pengantin = title.replace("&", "dan");

    const tglwaktu = encodeURI(undangan?.content?.resepsiTime);
    const tempat = encodeURI(undangan?.content?.resepsiPlace);
    const link = encodeURI(undangan?.permalink);

    const msg = `Bismillahirrahmanirrahim%0AAssalamu'alaikum Warahmatullahi Wabarakatuh%0A%0AYth. Bpk/Ibu/Sdr/i *${tamu}*,%0A%0ADengan mengharap ridha dan rahmat Allah SWT, serta tanpa mengurangi rasa hormat. Perkenankan kami mengundang Bpk/Ibu/Sdr/i untuk hadir di acara pernikahan kami:%0A%0A*Pernikahan ${pengantin}*%0A*Tanggal:* ${tglwaktu}%0A*Lokasi:* ${tempat}%0A%0AMerupakan suatu kehormatan bagi kami apabila Bpk/Ibu/Sdr/i dapat menghadiri/ menyaksikan prosesi pernikahan kami, serta jangan lupa konfirmasi kehadiranmu ya pada tautan dibawah ini:%0A%0Ahttps://kekawinan.com/${link}/${item.id}%0A%0AKami juga mengharapkan ucapan, harapan, serta doa Bpk/Ibu/Sdr/i untuk kami.%0A%0AAtas perhatiannya kami ucapkan terimakasih.`;

    sendWhatsappTamu(item.id, {
      onSuccess: () => {
        refetch();
        refetchTotalKirimWA();
      },
    });

    return window.open(
      `https://api.whatsapp.com/send/?phone=${phone}&text=${msg}`,
      "_blank",
    );
  };

  const handleDownloadQrPng = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas || !qrTamu) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${(qrTamu.name ?? qrTamu.id).replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const handleDownloadAllQr = async () => {
    const slug = undangan?.permalink;
    if (!slug) return;
    setIsDownloadingZip(true);
    try {
      const res = await undanganTamuApi.downloadQR(slug);
      const blob = new Blob([res.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-tamu-${slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent — user sudah tahu dari tidak ada respons
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const debounceSetParamsTable = useRef(
    debounce((searchText: string) => {
      setPage(1);
      setQueryParams((prev) => ({
        ...prev,
        search: searchText,
        page: 1,
      }));
    }, 500),
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
    if (undanganTamu) {
      setTableData(undanganTamu.rows);
      setSelectedIds(new Set()); // clear selection when page data changes
    }
    setIsDataLoaded(true);
  }, [undanganTamu]);

  useEffect(() => {
    if (isDataLoaded) {
      setPage(1);
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        sendStatus: filterSendStatus,
        isRead: filterIsRead,
        isConfirm: filterIsConfirm,
        isAttend: filterIsAttend,
      }));
    }
  }, [filterSendStatus, filterIsRead, filterIsConfirm, filterIsAttend]);

  useEffect(() => {
    return () => {
      debounceSetParamsTable.cancel();
    };
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const isAllOnPageSelected = tableData.length > 0 && tableData.every((t) => selectedIds.has(t.id));

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (tableData.every((t) => next.has(t.id))) {
        tableData.forEach((t) => next.delete(t.id));
      } else {
        tableData.forEach((t) => next.add(t.id));
      }
      return next;
    });
  }, [tableData]);

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      await undanganTamuApi.bulkDelete([...selectedIds]);
      toast.success(`${selectedIds.size} tamu berhasil dihapus`);
      setSelectedIds(new Set());
      refetch();
      refetchTotalKirimWA();
      refetchOverview();
    } catch {
      toast.error("Gagal menghapus tamu");
    } finally {
      setIsBulkDeleting(false);
      setIsOpenBulkDelete(false);
    }
  };

  const handleDownloadSelectedQR = async () => {
    const slug = undangan?.permalink;
    if (!slug || selectedIds.size === 0) return;
    setIsDownloadingSelectedQR(true);
    try {
      const res = await undanganTamuApi.downloadSelectedQR(slug, [...selectedIds]);
      const blob = new Blob([res.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-terpilih-${slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal mendownload QR");
    } finally {
      setIsDownloadingSelectedQR(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setIsImporting(true);
    try {
      const res = await tamuBulkApi.import(id, importFile);
      const data = res.data.data;
      setImportResult(data);
      refetch();
      refetchTotalKirimWA();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message ?? "Gagal mengimport file");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Tamu Undangan</h1>
        <p>
          Kamu dapat melihat perkiraan tamu yang akan hadir serta mengatur data
          tamu yang di undang
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">
              Total Tamu <br />
              Undangan
            </h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoading ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  undanganTamu?.total_data || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">
              Total Kirim <br />
              Whatsapp
            </h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingTotalKirimWA ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  totalKirimWA?.total_send || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">
              Total <br />
              Konfirmasi
            </h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingTotalKirimWA ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  totalKirimWA?.total_confirm || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">
              Membuka <br />
              Undangan
            </h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingTotalKirimWA ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  totalKirimWA?.total_read || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex items-end">
          <div>
            <h3 className="text-lg font-bold">
              Sudah Hadir <br />
              (Absensi)
            </h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoadingTotalKirimWA ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  totalKirimWA?.total_attended || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[900px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-4 border border-gray-200 flex items-end">
            <h3 className="font-semibold flex items-center gap-2 justify-center md:w-full">
              Total Tamu:{" "}
              {isLoadingOverview ? (
                <IconLoader2 size={20} className="animate-spin pb-1" />
              ) : (
                undanganOverview?.total_tamu || 0
              )}{" "}
              Orang
            </h3>
          </div>
          <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-4 border border-gray-200 flex items-end">
            <h3 className="font-semibold flex items-center gap-2 justify-center md:w-full">
              Akan Hadir:{" "}
              {isLoadingOverview ? (
                <IconLoader2 size={20} className="animate-spin pb-1" />
              ) : (
                undanganOverview?.total_tamu_hadir || 0
              )}{" "}
              Orang
            </h3>
          </div>
          <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-4 border border-gray-200 flex items-end">
            <h3 className="font-semibold flex items-center gap-2 justify-center md:w-full">
              Tidak Hadir:{" "}
              {isLoadingOverview ? (
                <IconLoader2 size={20} className="animate-spin pb-1" />
              ) : (
                undanganOverview?.total_tamu_tidak_hadir || 0
              )}{" "}
              Orang
            </h3>
          </div>
          <div className="rounded-2xl p-4 border border-gray-200 flex items-end bg-green-soft-kwn">
            <h3 className="font-semibold flex items-center gap-2 justify-center md:w-full">
              Sudah Hadir:{" "}
              {isLoadingOverview ? (
                <IconLoader2 size={20} className="animate-spin pb-1" />
              ) : (
                undanganOverview?.total_tamu_sudah_hadir || 0
              )}{" "}
              Orang
            </h3>
          </div>
        </div>
      </div>
      {/* Import Excel Card */}
      <div className="border border-border p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <IconFileSpreadsheet size={18} />
            Import Tamu dari Excel
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload file Excel sesuai template untuk menambahkan banyak tamu sekaligus.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/docs/template_tamu_undangan.xlsx"
            download
            className="inline-flex items-center gap-2 text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors"
          >
            <IconDownload size={14} />
            Download Template
          </a>
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                setImportFile(e.target.files?.[0] ?? null);
                setImportResult(null);
              }}
              disabled={isImporting}
              className="text-sm"
            />
          </div>
          <Button
            onClick={handleImport}
            disabled={!importFile || isImporting}
            size="sm"
          >
            {isImporting ? (
              <>
                <IconLoader2 size={14} className="animate-spin" />
                Memproses...
              </>
            ) : (
              "Upload & Proses"
            )}
          </Button>
          <a
            href={`/user/undangan/${id}/tamu-undangan/bulk-log`}
            className="text-sm text-primary underline underline-offset-2 ml-auto"
          >
            Lihat Log Import
          </a>
        </div>
        {importResult && (
          <div className="rounded-lg border px-4 py-3 flex flex-wrap items-center gap-4 text-sm bg-muted/30">
            <span className="text-green-600 font-medium">
              ✓ {importResult.success_count} tamu berhasil
            </span>
            {importResult.failed_count > 0 && (
              <span className="text-red-500 font-medium">
                ✗ {importResult.failed_count} baris gagal —{" "}
                <a
                  href={`/user/undangan/${id}/tamu-undangan/bulk-log`}
                  className="underline underline-offset-2"
                >
                  Lihat log
                </a>
              </span>
            )}
            <span className="text-muted-foreground">
              Total diproses: {importResult.total}
            </span>
          </div>
        )}
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex flex-wrap gap-2 justify-end items-center">
          {selectedIds.size > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedIds.size} Terpilih
                  <IconChevronDown size={14} className="ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-1" align="end">
                <button
                  onClick={handleDownloadSelectedQR}
                  disabled={isDownloadingSelectedQR}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {isDownloadingSelectedQR ? (
                    <IconLoader2 size={15} className="animate-spin" />
                  ) : (
                    <IconDownload size={15} />
                  )}
                  Download QR ({selectedIds.size})
                </button>
                <button
                  onClick={() => setIsOpenBulkDelete(true)}
                  disabled={isBulkDeleting}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <IconTrash size={15} />
                  Hapus Terpilih ({selectedIds.size})
                </button>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="outline"
            onClick={handleDownloadAllQr}
            disabled={isDownloadingZip}
          >
            {isDownloadingZip ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconDownload size={16} />
            )}
            Download Semua QR
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(true);
              setSelectedItem(null);
            }}
          >
            <IconPlus size={16} />
            Tambah Tamu
          </Button>
          <Select
            value={activeFilter}
            onValueChange={(v) => {
              setActiveFilter(v);
              setFilterSendStatus(
                v === "send_1" ? "1" : v === "send_0" ? "0" : "",
              );
              setFilterIsRead(v === "read_1" ? "1" : v === "read_0" ? "0" : "");
              setFilterIsConfirm(
                v === "confirm_1" ? "1" : v === "confirm_0" ? "0" : "",
              );
              setFilterIsAttend(
                v === "attend_1" ? "1" : v === "attend_0" ? "0" : "",
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="send_1">Sudah Dikirim</SelectItem>
              <SelectItem value="send_0">Belum Dikirim</SelectItem>
              <SelectItem value="read_1">Sudah Dilihat</SelectItem>
              <SelectItem value="read_0">Belum Dilihat</SelectItem>
              <SelectItem value="confirm_1">Sudah RSVP</SelectItem>
              <SelectItem value="confirm_0">Belum RSVP</SelectItem>
              <SelectItem value="attend_1">Sudah Absen</SelectItem>
              <SelectItem value="attend_0">Belum Absen</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tamu"
            className="max-w-xs"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={isAllOnPageSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Pilih semua"
                />
              </TableHead>
              <TableHead>Nama Tamu</TableHead>
              <TableHead>No. Whatsapp</TableHead>
              <TableHead>Total Tamu (Orang)</TableHead>
              <TableHead>Dilihat</TableHead>
              <TableHead>RSVP</TableHead>
              <TableHead>Absensi</TableHead>
              <TableHead>Hadir Pukul</TableHead>
              <TableHead className="text-right w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={9} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id} data-selected={selectedIds.has(item.id)} className="data-[selected=true]:bg-primary/5">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                      aria-label={`Pilih ${item.name}`}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.maxInvite}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isRead ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"}`}
                    >
                      {item.isRead ? "Sudah" : "Belum"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isConfirm ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"}`}
                    >
                      {item.isConfirm ? "Sudah" : "Belum"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isAttend ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {item.isAttend ? "Hadir" : "Belum"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {item.attendedAt
                      ? new Date(item.attendedAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right w-[10%]">
                    <div className="flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => setQrTamu(item)}
                            className="cursor-pointer border border-border rounded-md p-1 bg-white"
                          >
                            <IconQrcode size={18} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Lihat & Download QR</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => {
                              if (!item.sendStatus) {
                                handleSendWhatsapp(item);
                              }
                            }}
                            className={`${
                              !item.sendStatus
                                ? "bg-green-soft-kwn"
                                : "bg-white"
                            } cursor-pointer border border-border rounded-md p-1 `}
                          >
                            {!item.sendStatus ? (
                              <IconBrandWhatsapp size={18} />
                            ) : (
                              <IconSend2 size={18} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {item.sendStatus
                                ? "Undangan sudah dikirim"
                                : "Kirim Undangan melalui Whatsapp"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <MenuAction
                        handleLihat={() => setDetailItem(item)}
                        handleDelete={() => {
                          setIsOpenDelete(true);
                          setSelectedItem(item);
                        }}
                        handleEdit={() => {
                          setIsOpen(true);
                          setSelectedItem(item);
                          setName(item.name);
                          setPhone(item.phone);
                          setMaxInvite(item.maxInvite.toString());
                        }}
                        items={["Lihat", "Hapus", "Edit"]}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={9} />
            )}
          </TableBody>
        </Table>
        <Separator />
        {!isLoading && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={undanganTamu?.total_page}
            totalData={undanganTamu?.total_data}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
          setSelectedItem(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit" : "Tambah"} Tamu</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Tamu</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^\w\s]/gi, ""))
                  }
                  placeholder="Nama Tamu"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">
                  No. Whatsapp
                  {selectedItem?.isRead && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (tidak dapat diubah)
                    </span>
                  )}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="No. Whatsapp"
                  className="w-full"
                  disabled={!!selectedItem?.isRead}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_invite">
                  Jumlah Tamu
                  {selectedItem?.isConfirm && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (tidak dapat diubah)
                    </span>
                  )}
                </Label>
                <Select
                  value={max_invite}
                  onValueChange={(value) => setMaxInvite(value)}
                  disabled={!!selectedItem?.isConfirm}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jumlah Tamu" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedItem(null);
                }}
              >
                Batal
              </Button>
              <Button
                onClick={selectedItem ? handleUpdateTamu : handleCreateTamu}
                disabled={isPendingCreate || isPendingUpdate}
              >
                {isPendingCreate || isPendingUpdate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : selectedItem ? (
                  "Update Tamu"
                ) : (
                  "Tambah Tamu"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal QR per tamu */}
      <Dialog open={!!qrTamu} onOpenChange={() => setQrTamu(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>QR Code Tamu</DialogTitle>
            <DialogDescription>{qrTamu?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div
              ref={qrCanvasRef}
              className="p-3 bg-white rounded-xl border border-gray-200"
            >
              {qrTamu && undangan?.permalink && (
                <QRCodeCanvas
                  value={`${BASE_URL}/${undangan.permalink}/${qrTamu.id}`}
                  size={200}
                  level="M"
                />
              )}
            </div>
            <Button className="w-full" onClick={handleDownloadQrPng}>
              <IconDownload size={16} />
              Download PNG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detail Tamu */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Tamu</DialogTitle>
            <DialogDescription>{detailItem?.name}</DialogDescription>
          </DialogHeader>
          {detailItem && (
            <div className="flex flex-col divide-y divide-border/60 text-sm">
              <DetailRow
                label="ID Tamu"
                value={detailItem.id}
                copyable
                onCopy={() => {
                  navigator.clipboard.writeText(detailItem.id);
                  toast.success("ID Tamu disalin");
                }}
              />
              <DetailRow label="Nama Tamu" value={detailItem.name} />
              <DetailRow label="No. Whatsapp" value={detailItem.phone || "-"} />
              <DetailRow
                label="Total Tamu (Orang)"
                value={detailItem.maxInvite.toString()}
              />
              <DetailRow
                label="Status Kirim"
                value={detailItem.sendStatus ? "Sudah dikirim" : "Belum dikirim"}
              />
              <DetailRow
                label="Dilihat"
                value={detailItem.isRead ? "Sudah" : "Belum"}
              />
              <DetailRow
                label="RSVP"
                value={detailItem.isConfirm ? "Sudah" : "Belum"}
              />
              <DetailRow
                label="Absensi"
                value={detailItem.isAttend ? "Hadir" : "Belum"}
              />
              <DetailRow
                label="Hadir Pukul"
                value={
                  detailItem.attendedAt
                    ? new Date(detailItem.attendedAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-"
                }
              />
              <DetailRow
                label="Dikonfirmasi oleh"
                value={detailItem.confirmedBy || "-"}
              />
              <DetailRow
                label="Dibuat"
                value={new Date(detailItem.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk delete confirmation */}
      <AlertDialog open={isOpenBulkDelete} onOpenChange={setIsOpenBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus {selectedIds.size} Tamu
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Tindakan ini tidak dapat dibatalkan. {selectedIds.size} tamu yang dipilih akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                `Ya, Hapus ${selectedIds.size} Tamu`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              onClick={handleDeleteTamu}
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

function DetailRow({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium text-right break-all">{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 rounded-md border border-border p-1 text-muted-foreground hover:bg-primary hover:text-white"
            aria-label={`Salin ${label}`}
          >
            <IconCopy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
