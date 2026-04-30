"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Copy, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { IconPlus } from "@tabler/icons-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { debounce } from "lodash";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Pagination from "@/components/ui/custom/pagination";
import { formatDate } from "@/helper/date";
import { formatNumber } from "@/helper/number";
import { Params } from "@/frontend/interface/undangan";
import redeemCodesApi from "@/frontend/api/admin/redeem-codes";
import settingsApi from "@/frontend/api/admin/settings";
import AdminRedeemCodesStore from "@/frontend/store/admin-redeem-codes-store";
import { IconCoin } from "@tabler/icons-react";

interface RedeemCode {
  id: string;
  code: string;
  packageType: string;
  totalCredit: number;
  remainingCredit: number;
  usedBy: string | null;
  usedAt: string | null;
  expiredAt: string;
  status: string;
  note: string | null;
  generatedBy: string;
  createdAt: string;
}

const PACKAGE_TYPES = ["AKAD", "RESEPSI", "GRAND"];
const STATUS_FILTER = ["UNUSED", "USED", "EXPIRED"];

const statusBadge: Record<string, string> = {
  UNUSED: "bg-green-100 text-green-700",
  USED: "bg-gray-100 text-gray-600",
  EXPIRED: "bg-red-100 text-red-600",
};

const packageBadge: Record<string, string> = {
  AKAD: "bg-blue-50 text-blue-700",
  RESEPSI: "bg-purple-50 text-purple-700",
  GRAND: "bg-yellow-50 text-yellow-700",
};

export default function RedeemCodesPage() {
  const { generate } = AdminRedeemCodesStore();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tableData, setTableData] = useState<RedeemCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [packageFilter, setPackageFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Form state
  const [formPackage, setFormPackage] = useState("GRAND");
  const [formCredit, setFormCredit] = useState(1);
  const [formExpired, setFormExpired] = useState("");
  const [formNoExpired, setFormNoExpired] = useState(false);
  const [formNote, setFormNote] = useState("");

  const [queryParams, setQueryParams] = useState<Params & { status?: string; packageType?: string }>({
    limit,
    page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const { data: creditValue } = useQuery({
    queryKey: ["admin-settings-credit-value"],
    queryFn: () => settingsApi.getAll(),
    select: (data) => {
      const settings = data.data.data?.settings as { key: string; value: string }[] | undefined;
      const cv = settings?.find((s) => s.key === "credit_value");
      return cv ? Number(cv.value) : null;
    },
  });

  const { data: resultTable, isLoading, refetch } = useQuery({
    queryKey: ["redeem-codes-admin", queryParams],
    queryFn: () => redeemCodesApi.getAll(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (resultTable) setTableData(resultTable.rows);
    setIsDataLoaded(true);
  }, [resultTable]);

  useEffect(() => { refetch(); }, [queryParams]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page }));
  }, [page]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page: 1, limit }));
  }, [limit]);

  const debouncedApply = useRef(
    debounce((status: string, pkg: string) => {
      setPage(1);
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        status: status === "ALL" ? undefined : status,
        packageType: pkg === "ALL" ? undefined : pkg,
      }));
    }, 300)
  ).current;

  useEffect(() => {
    if (isDataLoaded) debouncedApply(statusFilter, packageFilter);
  }, [statusFilter, packageFilter]);

  useEffect(() => () => debouncedApply.cancel(), []);

  const resetForm = () => {
    setFormPackage("GRAND");
    setFormCredit(1);
    setFormExpired("");
    setFormNoExpired(false);
    setFormNote("");
  };

  const handleGenerate = () => {
    if (!formNoExpired && !formExpired) {
      toast.error("Tanggal expired wajib diisi, atau centang 'Tanpa Expired'");
      return;
    }
    generate.mutate(
      {
        packageType: formPackage,
        totalCredit: formCredit,
        expiredAt: formNoExpired ? undefined : new Date(formExpired).toISOString(),
        note: formNote || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            setIsOpen(false);
            resetForm();
            refetch();
          }
        },
      }
    );
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Kode disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Kode Redeem</h1>
        <p>Kelola kode redeem untuk pembelian undangan via Shopee.</p>
      </div>

      {/* Info credit value */}
      {creditValue !== null && creditValue !== undefined && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-soft-kwn rounded-xl border border-green-kwn/20 w-fit">
          <IconCoin size={20} className="text-green-kwn flex-shrink-0" />
          <span className="text-sm">
            Nilai 1 credit saat ini:{" "}
            <span className="font-semibold text-green-kwn">{formatNumber(creditValue)}</span>
            <span className="text-muted-foreground ml-2 text-xs">
              · Ubah di <a href="/admin/settings" className="underline hover:text-foreground">Settings</a>
            </span>
          </span>
        </div>
      )}

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                {STATUS_FILTER.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Semua Paket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Paket</SelectItem>
                {PACKAGE_TYPES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { resetForm(); setIsOpen(true); }}>
            <IconPlus size={16} />
            Generate Kode
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expired</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={7} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <code className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                      {item.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${packageBadge[item.packageType] ?? "bg-gray-100 text-gray-600"}`}>
                      {item.packageType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.remainingCredit} / {item.totalCredit}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusBadge[item.status] ?? ""}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{item.expiredAt ? formatDate(item.expiredAt) : <span className="text-muted-foreground text-xs">Tidak ada</span>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                    {item.note ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(item.code, item.id)}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={7} />
            )}
          </TableBody>
        </Table>

        <Separator />
        {!isLoading && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={resultTable?.total_page}
            totalData={resultTable?.total_data}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

      {/* Dialog Generate Kode */}
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Kode Redeem</DialogTitle>
            <DialogDescription>
              Kode akan dikirim ke pembeli setelah transaksi Shopee berhasil.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label>Paket <span className="text-red-500">*</span></Label>
              <Select value={formPackage} onValueChange={setFormPackage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Jumlah Credit</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={formCredit}
                onChange={(e) => setFormCredit(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Jumlah credit yang didapat user.</p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Berlaku Hingga {!formNoExpired && <span className="text-red-500">*</span>}</Label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formNoExpired}
                    onCheckedChange={(v) => {
                      setFormNoExpired(!!v);
                      if (v) setFormExpired("");
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Tanpa Expired</span>
                </label>
              </div>
              {!formNoExpired && (
                <Input
                  type="date"
                  value={formExpired}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFormExpired(e.target.value)}
                />
              )}
              {formNoExpired && (
                <p className="text-xs text-muted-foreground">Kode tidak akan pernah expired.</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Catatan <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Input
                placeholder="Contoh: Order Shopee #12345678"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generate.isPending || (!formNoExpired && !formExpired)}
            >
              {generate.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Membuat...</span></>
              ) : (
                "Generate Kode"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
