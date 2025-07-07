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

import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Pagination from "@/components/ui/custom/pagination";
import { formatDate } from "@/helper/date";

import { Params } from "@/frontend/interface/undangan";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { debounce } from "lodash";
import usersApi from "@/frontend/api/admin/users";

interface Users {
  id: string;
  email: string;
  fullname: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<Users[]>([]);

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
    queryKey: ["users-admin", queryParams],
    queryFn: () => usersApi.getUsers(queryParams),
    select: (data) => data.data.data,
    placeholderData: keepPreviousData,
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Daftar User</h1>
        <p>Daftar user yang sudah terdaftar di kekawinan.com</p>
      </div>

      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user"
            className="max-w-xs"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fullname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={4} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
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
    </div>
  );
}
