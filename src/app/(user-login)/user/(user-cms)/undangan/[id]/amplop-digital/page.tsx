"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import bankApi, { BankOption } from "@/frontend/api/bank";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import toast from "react-hot-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { UndanganGift } from "@/frontend/interface/undangan";

interface GiftForm {
  bankName: string;
  bankNumber: string;
  name: string;
}

const emptyForm: GiftForm = { bankName: "", bankNumber: "", name: "" };

export default function AmplopDigitalPage() {
  const params = useParams();
  const id = params.id as string;

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedGift, setSelectedGift] = useState<UndanganGift | null>(null);
  const [form, setForm] = useState<GiftForm>(emptyForm);

  // Address section (still single)
  const [name_address, setNameAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const { data: gifts = [], refetch: refetchGifts } = useQuery({
    queryKey: ["undangan-gift", id],
    queryFn: () => undanganContentApi.getDataGift(id),
    select: (data) => data.data.data as UndanganGift[],
  });

  const { data: banks = [] } = useQuery({
    queryKey: ["banks-list"],
    queryFn: () => bankApi.getAll(),
    select: (data) => data.data.data as BankOption[],
  });

  // Load address from first gift that has address data
  useEffect(() => {
    const withAddress = gifts.find((g) => g.nameAddress || g.phone || g.address);
    if (withAddress) {
      setNameAddress(withAddress.nameAddress || "");
      setPhone(withAddress.phone || "");
      setAddress(withAddress.address || "");
    }
  }, [gifts]);

  const { mutate: createGift, isPending: isCreating } = useMutation({
    mutationFn: (body: object) => undanganContentApi.createGift(id, body),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Rekening berhasil ditambahkan");
        setIsOpenForm(false);
        setForm(emptyForm);
        refetchGifts();
      } else {
        toast.error(data.data.message);
      }
    },
    onError: () => { toast.error("Gagal menambahkan rekening"); },
  });

  const { mutate: updateGift, isPending: isUpdating } = useMutation({
    mutationFn: (body: object) =>
      undanganContentApi.updateGift(id, selectedGift!.id, body),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Rekening berhasil diubah");
        setIsOpenForm(false);
        setSelectedGift(null);
        setForm(emptyForm);
        refetchGifts();
      } else {
        toast.error(data.data.message);
      }
    },
    onError: () => { toast.error("Gagal mengubah rekening"); },
  });

  const { mutate: deleteGift, isPending: isDeleting } = useMutation({
    mutationFn: (giftId: string) => undanganContentApi.deleteGift(id, giftId),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Rekening berhasil dihapus");
        setIsOpenDelete(false);
        setSelectedGift(null);
        refetchGifts();
      } else {
        toast.error(data.data.message);
      }
    },
    onError: () => { toast.error("Gagal menghapus rekening"); },
  });

  const openAdd = () => {
    setSelectedGift(null);
    setForm(emptyForm);
    setIsOpenForm(true);
  };

  const openEdit = (gift: UndanganGift) => {
    setSelectedGift(gift);
    setForm({ bankName: gift.bankName, bankNumber: gift.bankNumber, name: gift.name });
    setIsOpenForm(true);
  };

  const handleSubmit = () => {
    if (!form.bankName || !form.bankNumber || !form.name) return;
    // Always include current address data so dialog-gift can always find it
    const payload = {
      bankName: form.bankName,
      bankNumber: form.bankNumber,
      name: form.name,
      nameAddress: name_address || null,
      phone: phone || null,
      address: address || null,
    };
    if (selectedGift) {
      updateGift(payload);
    } else {
      createGift(payload);
    }
  };

  const handleSaveAddress = async () => {
    setIsSavingAddress(true);
    try {
      if (gifts.length === 0) {
        toast.error("Tambahkan rekening terlebih dahulu sebelum menyimpan alamat");
        return;
      }
      // Update address on ALL gift entries so dialog-gift always finds it
      await Promise.all(
        gifts.map((g) =>
          undanganContentApi.updateGift(id, g.id, {
            bankName: g.bankName,
            bankNumber: g.bankNumber,
            name: g.name,
            nameAddress: name_address || null,
            phone: phone || null,
            address: address || null,
          })
        )
      );
      toast.success("Alamat pengiriman kado berhasil disimpan");
      refetchGifts();
    } catch {
      toast.error("Gagal menyimpan alamat");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const isBusy = isCreating || isUpdating;

  const getBankOption = (bankName: string) =>
    banks.find((b) => b.name === bankName);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Amplop Digital</h1>
        <p>
          Dengan amplop digital, tamu undangan online dapat memberikan hadiah
          berupa uang yang di transfer ke rekening atau mengirim kado ke
          alamatmu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bank / eWallet section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Bank / eWallet</h2>
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} />
              Tambah Rekening
            </Button>
          </div>

          {gifts.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
              Belum ada rekening. Klik &ldquo;Tambah Rekening&rdquo; untuk menambahkan.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {gifts.map((gift) => {
                const bank = getBankOption(gift.bankName);
                return (
                  <div
                    key={gift.id}
                    className={`flex items-center justify-between border border-border rounded-xl p-4 gap-3 ${
                      bank?.color ? `bg-${bank.color}-50` : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {bank?.icon ? (
                        <div className="relative w-10 h-10 rounded-lg border border-border bg-white overflow-hidden flex-shrink-0">
                          <Image src={bank.icon} alt={bank.name} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          bank?.color ? `bg-${bank.color}-100 text-${bank.color}-700` : "bg-muted text-muted-foreground"
                        }`}>
                          {gift.bankName.slice(0, 3).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{gift.bankName}</p>
                        <p className="text-sm text-muted-foreground font-mono">{gift.bankNumber}</p>
                        <p className="text-xs text-muted-foreground">{gift.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(gift)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                        onClick={() => { setSelectedGift(gift); setIsOpenDelete(true); }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Penerima Kado section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Penerima Kado</h2>
          <div className="grid gap-2">
            <Label htmlFor="name_address">Nama Penerima</Label>
            <Input
              id="name_address"
              value={name_address}
              onChange={(e) => setNameAddress(e.target.value)}
              placeholder="Masukkan nama penerima"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Alamat Pengiriman Kado</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat pengiriman kado"
            />
          </div>
          <div>
            <Button onClick={handleSaveAddress} disabled={isSavingAddress}>
              {isSavingAddress ? (
                <><Loader2 className="animate-spin w-4 h-4" /><span>Menyimpan...</span></>
              ) : (
                "Simpan Alamat"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog: Tambah / Edit Rekening */}
      <Dialog
        open={isOpenForm}
        onOpenChange={(open) => {
          setIsOpenForm(open);
          if (!open) { setSelectedGift(null); setForm(emptyForm); }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGift ? "Edit Rekening" : "Tambah Rekening"}</DialogTitle>
            <DialogDescription>
              {selectedGift ? "Ubah data rekening bank / eWallet." : "Tambah rekening bank / eWallet baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Bank / eWallet <span className="text-red-500">*</span></Label>
              {banks.length > 0 ? (
                <Select
                  value={form.bankName}
                  onValueChange={(val) => setForm((f) => ({ ...f, bankName: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bank / eWallet..." />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.name}>
                        <div className="flex items-center gap-2">
                          {bank.icon ? (
                            <div className="relative w-5 h-5 flex-shrink-0">
                              <Image src={bank.icon} alt={bank.name} fill className="object-contain" />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                              bank.color ? `bg-${bank.color}-100 text-${bank.color}-700` : "bg-muted text-muted-foreground"
                            }`}>
                              {bank.code.slice(0, 2)}
                            </div>
                          )}
                          <span>{bank.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Nama bank / eWallet"
                  value={form.bankName}
                  onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label>Nomor Rekening / eWallet <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Contoh: 0812345678"
                value={form.bankNumber}
                onChange={(e) => setForm((f) => ({ ...f, bankNumber: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Nama Pemilik Rekening <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Nama sesuai rekening"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsOpenForm(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isBusy || !form.bankName || !form.bankNumber || !form.name}
            >
              {isBusy ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Hapus Rekening */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rekening</AlertDialogTitle>
            <AlertDialogDescription>
              Rekening <span className="font-semibold">{selectedGift?.bankName} - {selectedGift?.bankNumber}</span> akan dihapus.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenDelete(false); setSelectedGift(null); }}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedGift && deleteGift(selectedGift.id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Menghapus...</span></>
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
