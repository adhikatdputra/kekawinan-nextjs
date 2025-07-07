"use client";

import { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Pagination from "@/components/ui/custom/pagination";
import { formatDate } from "@/helper/date";

import { IconEye, IconLoader2 } from "@tabler/icons-react";
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

import { Params } from "@/frontend/interface/undangan";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import undanganApi from "@/frontend/api/admin/undangan";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Response {
  id: string;
  user_id: string;
  permalink: string;
  name: string;
  status: string;
  expired: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
  undangan_content: {
    date_wedding: null;
  };
  theme: {
    component_name: string;
  };
  user: {
    fullname: string;
    email: string;
  };
}

export default function UsersPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<Response[]>([]);

  const [selectedItem, setSelectedItem] = useState<Response | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [queryParams, setQueryParams] = useState<Params>({
    limit: limit,
    page: page,
    sortBy: "createdAt",
    order: "DESC",
  });

  const {
    data: responseTable,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["undangan-admin", queryParams],
    queryFn: () => undanganApi.getAll(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteUndangan, isPending: isPendingDelete } = useMutation({
    mutationFn: (id: string) => undanganApi.remove(id),
    onSuccess: () => {
      refetch();
      setIsOpenDelete(false);
      toast.success("Undangan berhasil dihapus");
    },
    onError: () => {
      toast.error("Undangan gagal dihapus");
    },
  });

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
    if (responseTable) {
      setTableData(responseTable.rows);
    }
    setIsDataLoaded(true);
  }, [responseTable]);

  useEffect(() => {
    return () => {
      debounceSetParamsTable.cancel();
    };
  }, []);

  const checkExpired = (expired: string) => {
    const now = new Date();
    const expiredDate = new Date(expired);
    return expiredDate < now;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Daftar Undangan</h1>
        <p>Daftar undangan yang sudah terdaftar di kekawinan.com</p>
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari undangan"
            className="max-w-xs"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Tgl Nikah</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={4} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.user?.fullname}</TableCell>
                  <TableCell>
                    {item.name}
                    <div>
                      <span className="font-semibold">Theme:</span>{" "}
                      {item.theme?.component_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold">Tanggal Nikah:</span>{" "}
                      <span
                        className={`${
                          item.undangan_content?.date_wedding &&
                          checkExpired(item.undangan_content?.date_wedding)
                            ? "bg-red-100"
                            : ""
                        }`}
                      >
                        {item.undangan_content?.date_wedding
                          ? formatDate(item.undangan_content?.date_wedding)
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Expired:</span>{" "}
                      <span
                        className={`${
                          checkExpired(item.expired) ? "bg-red-100" : ""
                        }`}
                      >
                        {item.expired ? formatDate(item.expired) : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <MenuAction
                      handleDelete={() => {
                        setIsOpenDelete(true);
                        setSelectedItem(item);
                      }}
                      items={["Hapus"]}
                      slotItem={
                        <Link
                          href={`/${item.permalink}`}
                          target="_blank"
                          className="w-full"
                        >
                          <Button
                            variant="ghost"
                            className="justify-start rounded-none hover:bg-green-kwn hover:text-white w-full"
                          >
                            <IconEye size={24} />
                            Lihat
                          </Button>
                        </Link>
                      }
                    />
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
            totalPage={responseTable?.total_page}
            totalData={responseTable?.count}
            pageSize={limit}
            setPageSize={setLimit}
            totalDataPerPage={tableData.length}
          />
        )}
      </div>

      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Undangan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus undangan{" "}
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
              onClick={() => {
                if (selectedItem) {
                  deleteUndangan(selectedItem.id);
                }
              }}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
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
