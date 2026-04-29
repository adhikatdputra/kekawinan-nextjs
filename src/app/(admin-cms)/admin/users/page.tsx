"use client";

import { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { IconPlus, IconUsers, IconUserCheck, IconLogin } from "@tabler/icons-react";

import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import Pagination from "@/components/ui/custom/pagination";
import MenuAction from "@/components/ui/custom/menu-action";
import { formatDate } from "@/helper/date";

import { Params } from "@/frontend/interface/undangan";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { debounce } from "lodash";
import usersApi from "@/frontend/api/admin/users";
import AdminUsersStore from "@/frontend/store/admin-users-store";

interface User {
  id: string;
  email: string;
  fullname: string;
  level: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  newUsers30d: number;
  loginUsers30d: number;
  loginToday: number;
}

export default function UsersPage() {
  const { create, update } = AdminUsersStore();
  const { mutate: createUser, isPending: isPendingCreate } = create;
  const { mutate: updateUser, isPending: isPendingUpdate } = update;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<User[]>([]);

  // Dialog states
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenPassword, setIsOpenPassword] = useState(false);
  const [isOpenToggleStatus, setIsOpenToggleStatus] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Create user form
  const [newFullname, setNewFullname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newLevel, setNewLevel] = useState("user");

  // Change password form
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");

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

  const { data: statsData } = useQuery({
    queryKey: ["users-admin-stats"],
    queryFn: () => usersApi.getStats(),
    select: (data) => data.data.data as UserStats,
  });

  const debounceSetParamsTable = useRef(
    debounce((searchText: string) => {
      setPage(1);
      setQueryParams((prev) => ({ ...prev, search: searchText, page: 1 }));
    }, 500)
  ).current;

  useEffect(() => {
    if (isDataLoaded) debounceSetParamsTable(search);
  }, [search]);

  useEffect(() => {
    refetch();
  }, [queryParams]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page }));
  }, [page]);

  useEffect(() => {
    if (isDataLoaded) setQueryParams((prev) => ({ ...prev, page: 1, limit }));
  }, [limit]);

  useEffect(() => {
    if (responseTable) setTableData(responseTable.rows);
    setIsDataLoaded(true);
  }, [responseTable]);

  useEffect(() => () => debounceSetParamsTable.cancel(), []);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const resetCreateForm = () => {
    setNewFullname("");
    setNewEmail("");
    setNewPassword("");
    setNewLevel("user");
  };

  const handleCreate = () => {
    if (!passwordRegex.test(newPassword)) return;
    createUser(
      { email: newEmail, fullname: newFullname, password: newPassword, level: newLevel },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            setIsOpenCreate(false);
            resetCreateForm();
            refetch();
          }
        },
      }
    );
  };

  const handleChangePassword = () => {
    if (!selectedUser) return;
    if (newPass !== newPassConfirm) return;
    if (!passwordRegex.test(newPass)) return;
    updateUser(
      { id: selectedUser.id, data: { password: newPass } },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            setIsOpenPassword(false);
            setSelectedUser(null);
            setNewPass("");
            setNewPassConfirm("");
          }
        },
      }
    );
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    updateUser(
      { id: selectedUser.id, data: { status: newStatus } },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            setIsOpenToggleStatus(false);
            setSelectedUser(null);
            refetch();
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Daftar User</h1>
        <p>Daftar user yang sudah terdaftar di kekawinan.com</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-xl">
            <IconUsers size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User Baru (30 hari)</p>
            <p className="text-2xl font-bold">{statsData?.newUsers30d ?? "—"}</p>
          </div>
        </div>
        <div className="border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
            <IconUserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Login (30 hari)</p>
            <p className="text-2xl font-bold">{statsData?.loginUsers30d ?? "—"}</p>
          </div>
        </div>
        <div className="border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
            <IconLogin size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Login Hari Ini</p>
            <p className="text-2xl font-bold">{statsData?.loginToday ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end items-center">
          <Button onClick={() => setIsOpenCreate(true)}>
            <IconPlus size={16} />
            Tambah User
          </Button>
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
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={6} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <MenuAction
                      items={[]}
                      slotItem={
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start rounded-none w-full hover:bg-green-soft-kwn text-sm"
                            onClick={() => {
                              setSelectedUser(item);
                              setIsOpenPassword(true);
                            }}
                          >
                            Ubah Password
                          </Button>
                          <Button
                            variant="ghost"
                            className={`justify-start rounded-none w-full text-sm ${
                              item.status === "ACTIVE"
                                ? "hover:bg-red-100 hover:text-red-700"
                                : "hover:bg-green-100 hover:text-green-700"
                            }`}
                            onClick={() => {
                              setSelectedUser(item);
                              setIsOpenToggleStatus(true);
                            }}
                          >
                            {item.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                        </>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={6} />
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

      {/* Dialog: Tambah User */}
      <Dialog
        open={isOpenCreate}
        onOpenChange={(open) => {
          setIsOpenCreate(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input value={newFullname} onChange={(e) => setNewFullname(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword && !passwordRegex.test(newPassword) && (
                <p className="text-xs text-red-500">
                  Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol (@$!%*?&)
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select value={newLevel} onValueChange={setNewLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => { setIsOpenCreate(false); resetCreateForm(); }}>
                Batal
              </Button>
              <Button onClick={handleCreate} disabled={isPendingCreate || !newFullname || !newEmail || !passwordRegex.test(newPassword)}>
                {isPendingCreate ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ubah Password */}
      <Dialog
        open={isOpenPassword}
        onOpenChange={(open) => {
          setIsOpenPassword(open);
          if (!open) { setSelectedUser(null); setNewPass(""); setNewPassConfirm(""); }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>
              Ubah password untuk user <span className="font-semibold">{selectedUser?.fullname}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Password Baru</Label>
              <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              {newPass && !passwordRegex.test(newPass) && (
                <p className="text-xs text-red-500">
                  Min. 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1 simbol (@$!%*?&)
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Konfirmasi Password</Label>
              <Input
                type="password"
                value={newPassConfirm}
                onChange={(e) => setNewPassConfirm(e.target.value)}
              />
              {newPass && newPassConfirm && newPass !== newPassConfirm && (
                <p className="text-xs text-red-500">Password tidak cocok</p>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsOpenPassword(false)}>
                Batal
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isPendingUpdate || !newPass || newPass !== newPassConfirm || !passwordRegex.test(newPass)}
              >
                {isPendingUpdate ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Toggle Status */}
      <AlertDialog open={isOpenToggleStatus} onOpenChange={setIsOpenToggleStatus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "ACTIVE" ? "Nonaktifkan User" : "Aktifkan User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "ACTIVE"
                ? `User ${selectedUser?.fullname} akan dinonaktifkan dan tidak bisa login.`
                : `User ${selectedUser?.fullname} akan diaktifkan kembali.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenToggleStatus(false); setSelectedUser(null); }}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={isPendingUpdate}>
              {isPendingUpdate ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Memproses...</span></>
              ) : selectedUser?.status === "ACTIVE" ? (
                "Ya, Nonaktifkan"
              ) : (
                "Ya, Aktifkan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
