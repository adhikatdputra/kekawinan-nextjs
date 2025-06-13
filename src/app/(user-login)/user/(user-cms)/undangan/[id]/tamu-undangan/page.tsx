"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Params, UndanganTamu } from "@/frontend/interface/undangan";
import { IconSend2, IconPlus, IconBrandWhatsapp } from "@tabler/icons-react";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";
import { IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

import { useQuery } from "@tanstack/react-query";
import TamuStore from "@/frontend/store/tamu-store";
import { debounce } from "lodash";
import undanganTamuApi from "@/frontend/api/undangan-tamu";
import undanganApi from "@/frontend/api/undangan";
import { toast } from "react-hot-toast";

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

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

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
  });

  const {
    data: totalKirimWA,
    isLoading: isLoadingTotalKirimWA,
    refetch: refetchTotalKirimWA,
  } = useQuery({
    queryKey: ["total-tamu", id],
    queryFn: () => undanganTamuApi.totalKirimWA(id),
    select: (data) => data.data.data,
  });

  const handleDeleteTamu = () => {
    deleteTamu(selectedItem?.id as string, {
      onSuccess: (data) => {
        const res = data.data;
        if (res.success) {
          refetch();
          refetchTotalKirimWA();
          toast.success("Tamu berhasil dihapus");
        } else {
          toast.error(res.message);
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", changeNoPhone(phone));
    formData.append("max_invite", max_invite);
    formData.append("undangan_id", id);
    createTamu(formData, {
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
          toast.success("Tamu berhasil dibuat");
        } else {
          toast.error(res.message);
        }
      },
    });
  };

  const handleUpdateTamu = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", changeNoPhone(phone));
    formData.append("max_invite", max_invite);
    formData.append("send_status", "0");
    formData.append("undangan_id", id);
    updateTamu(
      {
        id: selectedItem?.id as string,
        data: formData,
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
            toast.success("Tamu berhasil diubah");
          } else {
            toast.error(res.message);
          }
        },
      }
    );
  };

  const handleSendWhatsapp = (item: UndanganTamu) => {
    const phone = item.phone;

    const name = item.name;
    const tamu = name.replace("&", "dan");

    const title = undangan?.name;
    const pengantin = title.replace("&", "dan");

    const tglwaktu = encodeURI(undangan?.undangan_content?.resepsi_time);
    const tempat = encodeURI(undangan?.undangan_content?.resepsi_place);
    const link = encodeURI(undangan?.permalink);

    const msg = `Bismillahirrahmanirrahim%0AAssalamu'alaikum Warahmatullahi Wabarakatuh%0A%0AYth. Bpk/Ibu/Sdr/i *${tamu}*,%0A%0ADengan mengharap ridha dan rahmat Allah SWT, serta tanpa mengurangi rasa hormat. Perkenankan kami mengundang Bpk/Ibu/Sdr/i untuk hadir di acara pernikahan kami:%0A%0A*Nama:* ${pengantin}%0A*Acara:* ${tglwaktu}%0A*Lokasi:* ${tempat}%0A%0AMerupakan suatu kehormatan bagi kami apabila Bpk/Ibu/Sdr/i dapat menghadiri/ menyaksikan prosesi pernikahan kami, serta jangan lupa konfirmasi kehadiranmu ya pada tautan dibawah ini:%0A%0Ahttps://kekawinan.com/${link}/${item.id}%0A%0AKami juga mengharapkan ucapan, harapan, serta doa Bpk/Ibu/Sdr/i untuk kami.%0A%0AAtas perhatiannya kami ucapkan terimakasih.`;

    sendWhatsappTamu(item.id, {
      onSuccess: () => {
        refetch();
        refetchTotalKirimWA();
      },
    });

    return window.open(
      `https://api.whatsapp.com/send/?phone=${phone}&text=${msg}`,
      "_blank"
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
    if (undanganTamu) {
      setTableData(undanganTamu.rows);
    }
    setIsDataLoaded(true);
  }, [undanganTamu]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">Total Tamu Undangan</h3>
            <div className="flex items-end gap-2 mt-4">
              <h6 className="text-6xl font-bold">
                {isLoading ? (
                  <IconLoader2 size={40} className="animate-spin pb-1" />
                ) : (
                  undanganTamu?.count || 0
                )}
              </h6>
              <p className="text-muted-foreground pb-1">Tamu</p>
            </div>
          </div>
        </div>
        <div className="bg-[url('/images/bg-fitur.png')] bg-cover bg-center rounded-2xl p-6 border border-gray-200 min-h-[180px] flex  items-end">
          <div>
            <h3 className="text-lg font-bold">Total Kirim Whatsapp</h3>
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
            <h3 className="text-lg font-bold">Total Konfirmasi</h3>
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
            <h3 className="text-lg font-bold">Membuka Undangan</h3>
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
      </div>
      <div className="border border-border p-6 rounded-2xl grid gap-4">
        <div className="flex gap-2 justify-end items-center">
          <Button onClick={() => setIsOpen(true)}>
            <IconPlus size={16} />
            Tambah Tamu
          </Button>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ucapan"
            className="max-w-xs"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tamu</TableHead>
              <TableHead>No. Whatsapp</TableHead>
              <TableHead>Tamu</TableHead>
              <TableHead>Dilihat</TableHead>
              <TableHead>Konfirmasi</TableHead>
              <TableHead className="text-right w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={6} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.max_invite}</TableCell>
                  <TableCell>{item.is_read ? "Sudah" : "Belum"}</TableCell>
                  <TableCell>{item.is_confirm ? "Sudah" : "Belum"}</TableCell>
                  <TableCell className="text-right w-[10%]">
                    <div className="flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => {
                              if (!item.send_status) {
                                handleSendWhatsapp(item);
                              }
                            }}
                            className={`${
                              !item.send_status
                                ? "bg-green-soft-kwn"
                                : "bg-white"
                            } cursor-pointer border border-border rounded-md p-1 `}
                          >
                            {!item.send_status ? (
                              <IconBrandWhatsapp size={18} />
                            ) : (
                              <IconSend2 size={18} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {item.send_status
                                ? "Undangan sudah dikirim"
                                : "Kirim Undangan melalui Whatsapp"}
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
                          setIsOpen(true);
                          setSelectedItem(item);
                          setName(item.name);
                          setPhone(item.phone);
                          setMaxInvite(item.max_invite.toString());
                        }}
                        items={["Hapus", "Edit"]}
                      />
                    </div>
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
            totalPage={undanganTamu?.total_page}
            totalData={undanganTamu?.count}
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
                <Label htmlFor="phone">No. Whatsapp</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No. Whatsapp"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_invite">Jumlah Tamu</Label>
                <Select
                  value={max_invite}
                  onValueChange={(value) => setMaxInvite(value)}
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
