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
  IconSearch,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import { IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import Link from "next/link";
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
  TableCaption,
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
import { renderWhatsappMessage } from "@/lib/whatsapp-message";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

// "Belum" is a normal waiting state, not an error, so it stays neutral
function StatusBadge({ done, doneLabel }: { done: boolean; doneLabel: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold ${
        done ? "bg-brand-mint text-brand-green" : "bg-brand-cream text-brand-muted ring-1 ring-brand-line"
      }`}
    >
      {done ? doneLabel : "Belum"}
    </span>
  );
}

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

  const buildInvitationMessage = (item: UndanganTamu) =>
    renderWhatsappMessage(undangan?.content?.whatsappMessage, {
      nama_tamu: item.name.replace("&", "dan"),
      pengantin: undangan?.content?.title?.replace("&", "dan") ?? "",
      tanggal: undangan?.content?.resepsiTime ?? "",
      lokasi: undangan?.content?.resepsiPlace ?? "",
      link: `https://kekawinan.com/${undangan?.permalink ?? ""}/${item.id}`,
    });

  const handleCopyInvitationMessage = async (item: UndanganTamu) => {
    try {
      await navigator.clipboard.writeText(buildInvitationMessage(item));
      toast.success("Teks undangan disalin");
    } catch {
      toast.error("Gagal menyalin teks undangan");
    }
  };

  const handleSendWhatsapp = (item: UndanganTamu) => {
    const phone = item.phone;
    const msg = encodeURIComponent(buildInvitationMessage(item));

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

  const funnel = [
    {
      label: "Tamu di daftar",
      value: undanganTamu?.total_data,
      loading: isLoading,
      className: "bg-brand-green text-white",
      unitClassName: "text-white/80",
    },
    { label: "Dikirim lewat WhatsApp", value: totalKirimWA?.total_send },
    { label: "Membuka undangan", value: totalKirimWA?.total_read },
    { label: "Sudah RSVP", value: totalKirimWA?.total_confirm },
    { label: "Sudah hadir (absensi)", value: totalKirimWA?.total_attended },
  ];

  const attendance = [
    { label: "orang diundang", value: undanganOverview?.total_tamu },
    { label: "akan hadir", value: undanganOverview?.total_tamu_hadir },
    { label: "tidak hadir", value: undanganOverview?.total_tamu_tidak_hadir },
    { label: "sudah hadir", value: undanganOverview?.total_tamu_sudah_hadir },
  ];

  const isFiltered = !!queryParams.search || activeFilter !== "all";
  const iconButton = `cursor-pointer rounded-md border p-1 ${focusRing} focus-visible:outline-offset-2`;

  return (
    <div className="flex flex-col gap-8 text-brand-ink">
      <header className="relative overflow-hidden rounded-2xl bg-brand-sky p-6 sm:p-8 sm:pr-[200px]">
        <h1 className="font-recoleta-alt text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] font-bold tracking-[-0.02em]">
          Tamu undangan
        </h1>
        <p className="mt-3 max-w-[560px] leading-[1.7] text-brand-muted">
          Tambahkan tamu, kirim undangan lewat WhatsApp, lalu pantau siapa yang
          sudah membuka, RSVP, dan hadir.
        </p>
        <div className="absolute -bottom-2 right-6 hidden w-[160px] sm:block" aria-hidden="true">
          <div className="absolute inset-x-[4%] top-[14%] bottom-0 rounded-[48%_48%_16px_16px] bg-brand-yellow" />
          <BrandCharacter character="courier" className="relative w-full" />
        </div>
      </header>

      <section aria-labelledby="ringkasan-heading" className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <h2 id="ringkasan-heading" className="sr-only">Ringkasan tamu</h2>
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {funnel.map((stat) => {
            const loading = stat.loading ?? isLoadingTotalKirimWA;
            return (
              <div
                key={stat.label}
                className={`flex min-h-[132px] flex-col rounded-2xl p-4 sm:p-5 ${stat.className ?? "border border-brand-line bg-brand-cream"}`}
              >
                <dt className="font-bold leading-snug">{stat.label}</dt>
                <dd className="mt-auto flex items-baseline gap-1.5 pt-4">
                  <span className="font-recoleta-alt text-[clamp(2rem,3.5vw,2.75rem)] leading-none font-bold">
                    {loading ? (
                      <IconLoader2 size={28} className="animate-spin" aria-label="Memuat" />
                    ) : (
                      stat.value || 0
                    )}
                  </span>
                  <span className={`text-sm ${stat.unitClassName ?? "text-brand-muted"}`}>tamu</span>
                </dd>
              </div>
            );
          })}
        </dl>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl bg-brand-mint px-4 py-3 text-sm">
          <span className="font-bold">Perkiraan kehadiran</span>
          {attendance.map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <strong className="font-bold text-brand-green">
                {isLoadingOverview ? (
                  <IconLoader2 size={14} className="animate-spin" aria-label="Memuat" />
                ) : (
                  item.value || 0
                )}
              </strong>
              {item.label}
            </span>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="import-heading"
        className="grid grid-cols-[minmax(0,1fr)] gap-4 rounded-2xl border border-brand-line bg-brand-cream p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id="import-heading" className="flex items-center gap-2 font-bold">
              <IconFileSpreadsheet size={20} className="text-brand-leaf" aria-hidden="true" />
              Import tamu dari Excel
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Tambahkan banyak tamu sekaligus dalam dua langkah.
            </p>
          </div>
          <Link
            href={`/user/undangan/${id}/tamu-undangan/bulk-log`}
            className={`text-sm font-bold text-brand-green underline underline-offset-4 ${focusRing}`}
          >
            Lihat log import
          </Link>
        </div>
        <ol className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <li className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <p className="text-sm">
              <span className="font-bold">1. Isi template</span>
              <span className="block text-brand-muted">Satu baris untuk satu tamu.</span>
            </p>
            <a
              href="/docs/template_tamu_undangan.xlsx"
              download
              className={`mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-line px-4 text-sm font-bold transition-colors hover:bg-brand-mint ${focusRing}`}
            >
              <IconDownload size={16} aria-hidden="true" />
              Download template
            </a>
          </li>
          <li className="flex flex-col gap-3 rounded-xl bg-white p-4">
            <p className="text-sm">
              <span className="font-bold">2. Upload file</span>
              <span className="block text-brand-muted">Format .xlsx atau .xls.</span>
            </p>
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              {/* Native input stays focusable; the label is the visible picker */}
              <input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  setImportFile(e.target.files?.[0] ?? null);
                  setImportResult(null);
                }}
                disabled={isImporting}
                className="peer sr-only"
              />
              <label
                htmlFor="import-file"
                className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand-line px-4 text-sm transition-colors hover:bg-brand-mint peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-focus"
              >
                <IconFileSpreadsheet size={16} className="shrink-0 text-brand-leaf" aria-hidden="true" />
                {importFile ? (
                  <span className="truncate font-bold">{importFile.name}</span>
                ) : (
                  <span className="text-brand-muted">Pilih file Excel</span>
                )}
              </label>
              <button
                type="button"
                onClick={handleImport}
                disabled={!importFile || isImporting}
                className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-brand-green ${focusRing}`}
              >
                {isImporting ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
                    Memproses…
                  </>
                ) : (
                  "Upload & proses"
                )}
              </button>
            </div>
          </li>
        </ol>
        {importResult && (
          <div
            role="status"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-white px-4 py-3 text-sm"
          >
            <span className="flex items-center gap-1.5 font-bold text-brand-green">
              <IconCircleCheck size={18} aria-hidden="true" />
              {importResult.success_count} tamu berhasil
            </span>
            {importResult.failed_count > 0 && (
              <span className="flex items-center gap-1.5 font-bold text-brand-rose">
                <IconAlertTriangle size={18} aria-hidden="true" />
                {importResult.failed_count} baris gagal,
                <Link
                  href={`/user/undangan/${id}/tamu-undangan/bulk-log`}
                  className={`underline underline-offset-4 ${focusRing}`}
                >
                  lihat log
                </Link>
              </span>
            )}
            <span className="text-brand-muted">Total diproses: {importResult.total}</span>
          </div>
        )}
      </section>

      <section aria-labelledby="daftar-tamu-heading" className="grid grid-cols-[minmax(0,1fr)] gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="daftar-tamu-heading" className="font-recoleta-alt text-2xl font-bold">
              Daftar tamu
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Klik ikon WhatsApp untuk mengirim undangan ke tiap tamu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setSelectedItem(null);
            }}
            className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-brand-green px-5 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark lg:self-auto ${focusRing}`}
          >
            <IconPlus size={18} aria-hidden="true" />
            Tambah tamu
          </button>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-brand-mint px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <IconBrandWhatsapp size={18} className="mt-0.5 shrink-0 text-brand-green" aria-hidden="true" />
            <span>
              Teks pesan WhatsApp bisa kamu ubah sendiri.{" "}
              <span className="text-brand-muted">
                {undangan?.content?.whatsappMessage
                  ? "Sekarang memakai teks buatanmu."
                  : "Sekarang memakai teks bawaan."}
              </span>
            </span>
          </p>
          <Link
            href={`/user/undangan/${id}/setting`}
            className={`shrink-0 self-start pl-[26px] font-bold text-brand-green underline underline-offset-4 sm:self-auto sm:pl-0 ${focusRing}`}
          >
            Ubah teks pesan
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <label htmlFor="cari-tamu" className="sr-only">
              Cari tamu
            </label>
            <IconSearch
              size={18}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-brand-muted"
              aria-hidden="true"
            />
            <Input
              id="cari-tamu"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama tamu"
              className="h-11 rounded-xl border-brand-line bg-white pl-10 text-brand-ink focus-visible:border-brand-focus focus-visible:ring-brand-focus/30"
            />
          </div>
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
            <SelectTrigger
              className="h-11! w-[180px] rounded-xl border-brand-line bg-white text-brand-ink"
              aria-label="Filter status tamu"
            >
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua tamu</SelectItem>
              <SelectItem value="send_1">Sudah dikirim</SelectItem>
              <SelectItem value="send_0">Belum dikirim</SelectItem>
              <SelectItem value="read_1">Sudah dilihat</SelectItem>
              <SelectItem value="read_0">Belum dilihat</SelectItem>
              <SelectItem value="confirm_1">Sudah RSVP</SelectItem>
              <SelectItem value="confirm_0">Belum RSVP</SelectItem>
              <SelectItem value="attend_1">Sudah absen</SelectItem>
              <SelectItem value="attend_0">Belum absen</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {selectedIds.size > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-brand-green bg-brand-mint font-bold text-brand-green hover:bg-brand-mint"
                  >
                    {selectedIds.size} dipilih
                    <IconChevronDown size={16} aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-1" align="end">
                  <button
                    onClick={handleDownloadSelectedQR}
                    disabled={isDownloadingSelectedQR}
                    className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-sm transition-colors hover:bg-brand-mint disabled:opacity-50"
                  >
                    {isDownloadingSelectedQR ? (
                      <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <IconDownload size={16} aria-hidden="true" />
                    )}
                    Download QR ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => setIsOpenBulkDelete(true)}
                    disabled={isBulkDeleting}
                    className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-sm text-brand-rose transition-colors hover:bg-brand-pink disabled:opacity-50"
                  >
                    <IconTrash size={16} aria-hidden="true" />
                    Hapus terpilih ({selectedIds.size})
                  </button>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="outline"
              onClick={handleDownloadAllQr}
              disabled={isDownloadingZip}
              className="h-11 rounded-xl border-brand-line bg-white font-bold text-brand-ink hover:bg-brand-mint"
            >
              {isDownloadingZip ? (
                <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <IconDownload size={16} aria-hidden="true" />
              )}
              Download semua QR
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-line">
          <Table>
            <TableCaption className="sr-only">Daftar tamu undangan</TableCaption>
            <TableHeader>
              <TableRow className="border-brand-line hover:bg-transparent [&>th]:text-brand-muted">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={isAllOnPageSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Pilih semua tamu di halaman ini"
                  />
                </TableHead>
                <TableHead>Nama tamu</TableHead>
                <TableHead>No. WhatsApp</TableHead>
                <TableHead>Jumlah orang</TableHead>
                <TableHead>Dilihat</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Absensi</TableHead>
                <TableHead>Hadir pukul</TableHead>
                <TableHead className="w-[10%] pr-4 text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TablePending colSpan={9} />
              ) : tableData.length > 0 ? (
                tableData.map((item) => (
                  <TableRow
                    key={item.id}
                    data-selected={selectedIds.has(item.id)}
                    className="border-brand-line hover:bg-brand-cream data-[selected=true]:bg-brand-mint/60"
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        aria-label={`Pilih ${item.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell className="tabular-nums">{item.phone}</TableCell>
                    <TableCell>{item.maxInvite}</TableCell>
                    <TableCell>
                      <StatusBadge done={!!item.isRead} doneLabel="Sudah" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge done={!!item.isConfirm} doneLabel="Sudah" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge done={!!item.isAttend} doneLabel="Hadir" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-brand-muted tabular-nums">
                      {item.attendedAt
                        ? new Date(item.attendedAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZoneName: "short",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="w-[10%] pr-4 text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => setQrTamu(item)}
                              aria-label={`QR code ${item.name}`}
                              className={`${iconButton} border-brand-line bg-white hover:bg-brand-mint`}
                            >
                              <IconQrcode size={18} aria-hidden="true" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lihat & download QR</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                handleSendWhatsapp(item);
                              }}
                              aria-label={
                                item.sendStatus
                                  ? `Kirim ulang undangan ke ${item.name} lewat WhatsApp`
                                  : `Kirim undangan ke ${item.name} lewat WhatsApp`
                              }
                              className={`${iconButton} ${
                                !item.sendStatus
                                  ? "border-brand-green bg-brand-mint text-brand-green"
                                  : "border-brand-line bg-white text-brand-muted hover:bg-brand-mint"
                              }`}
                            >
                              {!item.sendStatus ? (
                                <IconBrandWhatsapp size={18} aria-hidden="true" />
                              ) : (
                                <IconSend2 size={18} aria-hidden="true" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.sendStatus
                                  ? "Undangan sudah dikirim"
                                  : "Kirim undangan lewat WhatsApp"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                handleCopyInvitationMessage(item);
                              }}
                              aria-label={`Salin teks undangan untuk ${item.name}`}
                              className={`${iconButton} border-brand-line bg-white hover:bg-brand-mint`}
                            >
                              <IconCopy size={18} aria-hidden="true" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Salin teks undangan</p>
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
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={9} className="py-10 text-center whitespace-normal">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <BrandCharacter character="gift" className="w-28" />
                      {isFiltered ? (
                        <>
                          <p className="mt-4 font-bold">Tidak ada tamu yang cocok</p>
                          <p className="mt-1 text-sm text-brand-muted">
                            Coba kata lain atau pilih filter &ldquo;Semua tamu&rdquo;.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-4 font-bold">Belum ada tamu</p>
                          <p className="mt-1 text-sm text-brand-muted">
                            Tambahkan satu per satu, atau import dari Excel di atas.
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
                totalPage={undanganTamu?.total_page}
                totalData={undanganTamu?.total_data}
                pageSize={limit}
                setPageSize={setLimit}
                totalDataPerPage={tableData.length}
              />
            </div>
          )}
        </div>
      </section>

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
                className="bg-brand-green hover:bg-brand-green-dark"
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
            <Button className="w-full bg-brand-green hover:bg-brand-green-dark" onClick={handleDownloadQrPng}>
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
              Hapus tamu
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus tamu{" "}
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
