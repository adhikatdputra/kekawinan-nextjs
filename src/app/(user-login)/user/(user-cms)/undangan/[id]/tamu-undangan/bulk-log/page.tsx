"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/custom/pagination";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import tamuBulkApi from "@/frontend/api/tamu-bulk";
import toast from "react-hot-toast";

interface BulkLogRow {
  id: string;
  undanganId: string;
  batchId: string;
  rowNumber: number;
  name: string | null;
  phone: string | null;
  maxInvite: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditState {
  name: string;
  phone: string;
  maxInvite: string;
}

export default function BulkLogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState>({ name: "", phone: "", maxInvite: "" });
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryParams = { page, limit };

  const {
    data: logsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tamu-bulk-log", id, queryParams],
    queryFn: () => tamuBulkApi.getLogs(id, queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const rows: BulkLogRow[] = logsData?.rows ?? [];
  const totalData: number = logsData?.total_data ?? 0;
  const totalPage: number = logsData?.total_page ?? 1;

  const startEdit = (row: BulkLogRow) => {
    setEditingId(row.id);
    setEditValues({
      name: row.name ?? "",
      phone: row.phone ?? "",
      maxInvite: row.maxInvite != null ? String(row.maxInvite) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (row: BulkLogRow) => {
    try {
      await tamuBulkApi.updateLog(row.id, {
        name: editValues.name,
        phone: editValues.phone,
        maxInvite: editValues.maxInvite !== "" ? editValues.maxInvite : undefined,
      });
      setEditingId(null);
      refetch();
      toast.success("Berhasil disimpan");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message ?? "Gagal menyimpan");
    }
  };

  const handleRetry = async (row: BulkLogRow) => {
    const isEditing = editingId === row.id;
    const payload = isEditing
      ? {
          name: editValues.name,
          phone: editValues.phone,
          maxInvite: editValues.maxInvite !== "" ? editValues.maxInvite : undefined,
        }
      : {};

    setRetryingId(row.id);
    try {
      await tamuBulkApi.retry(row.id, payload);
      toast.success("Berhasil ditambahkan sebagai tamu");
      setEditingId(null);
      refetch();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message ?? "Gagal menambahkan tamu");
      // Refetch to get updated errorMessage
      refetch();
    } finally {
      setRetryingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await tamuBulkApi.deleteLog(id);
      toast.success("Log berhasil dihapus");
      refetch();
    } catch {
      toast.error("Gagal menghapus log");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, limit]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <button
          type="button"
          onClick={() => router.push(`/user/undangan/${id}/tamu-undangan`)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Log Import Bulk</h1>
          <p className="text-muted-foreground text-sm">
            Daftar baris yang gagal diimport. Perbaiki dan coba lagi, atau hapus.
          </p>
        </div>
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No. Baris</TableHead>
              <TableHead>Nama Tamu</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead className="w-[120px]">Total Tamu</TableHead>
              <TableHead>Alasan Gagal</TableHead>
              <TableHead className="text-right w-[200px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={6} />
            ) : rows.length > 0 ? (
              rows.map((row) => {
                const isEditing = editingId === row.id;
                const isRetrying = retryingId === row.id;
                const isDeleting = deletingId === row.id;
                const isBusy = isRetrying || isDeleting;

                return (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground">{row.rowNumber}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="h-8 text-sm"
                          placeholder="Nama tamu"
                        />
                      ) : (
                        row.name ?? <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.phone}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="h-8 text-sm"
                          placeholder="08xxx atau 62xxx"
                        />
                      ) : (
                        row.phone ?? <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.maxInvite}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, maxInvite: e.target.value }))
                          }
                          className="h-8 text-sm w-20"
                          placeholder="1-20"
                          type="number"
                          min={1}
                          max={20}
                        />
                      ) : (
                        row.maxInvite ?? <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-red-500">{row.errorMessage ?? "-"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end flex-wrap">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              disabled={isBusy}
                            >
                              Batal
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => saveEdit(row)}
                              disabled={isBusy}
                            >
                              Simpan
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(row)}
                            disabled={isBusy}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleRetry(row)}
                          disabled={isBusy}
                        >
                          {isRetrying ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Coba Lagi"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(row.id)}
                          disabled={isBusy}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Hapus"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableNoData colSpan={6} />
            )}
          </TableBody>
        </Table>

        {!isLoading && rows.length === 0 && totalData === 0 && (
          <div className="text-center py-8 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Semua data berhasil diimport!</p>
            <Button
              variant="outline"
              onClick={() => router.push(`/user/undangan/${id}/tamu-undangan`)}
            >
              <IconArrowLeft size={16} />
              Kembali ke Tamu Undangan
            </Button>
          </div>
        )}

        {!isLoading && rows.length > 0 && (
          <>
            <Separator />
            <Pagination
              page={page}
              setPage={setPage}
              totalPage={totalPage}
              totalData={totalData}
              pageSize={limit}
              setPageSize={setLimit}
              totalDataPerPage={rows.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
