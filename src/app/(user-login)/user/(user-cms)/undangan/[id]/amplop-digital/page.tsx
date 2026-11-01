"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import bankApi, { BankOption } from "@/frontend/api/bank";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import { IconPlus, IconEdit, IconTrash, IconLoader2 } from "@tabler/icons-react";
import {
  CmsPageHeader,
  CmsSection,
  CmsField,
  cmsFocusRing,
  cmsInput,
  cmsTextarea,
  cmsPrimaryButton,
  cmsSecondaryButton,
} from "@/components/pages/undangan/cms-ui";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import { UndanganGift } from "@/frontend/interface/undangan";
import { getBankPalette } from "@/lib/bank-colors";

interface GiftForm {
  bankId: string;
  bankName: string;
  bankNumber: string;
  name: string;
}

const emptyForm: GiftForm = { bankId: "", bankName: "", bankNumber: "", name: "" };

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
    setForm({
      bankId: gift.bankId ?? gift.bank?.id ?? "",
      bankName: gift.bank?.name ?? gift.bankName,
      bankNumber: gift.bankNumber,
      name: gift.name,
    });
    setIsOpenForm(true);
  };

  const findBankOption = (bankId?: string | null, bankName?: string | null) =>
    banks.find((bank) => bank.id === bankId) ?? banks.find((bank) => bank.name === bankName);

  const handleSubmit = () => {
    const selectedBankOption = findBankOption(form.bankId, form.bankName);
    const bankName = selectedBankOption?.name ?? form.bankName;
    if (!bankName || !form.bankNumber || !form.name) return;
    // Always include current address data so dialog-gift can always find it
    const payload = {
      bankId: selectedBankOption?.id ?? (form.bankId || null),
      bankName,
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
            bankId: g.bankId ?? g.bank?.id ?? null,
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

  const getBankOption = (gift: UndanganGift) =>
    gift.bank ?? findBankOption(gift.bankId, gift.bankName);

  const iconAction = `grid size-10 cursor-pointer place-items-center rounded-lg transition-colors ${cmsFocusRing} focus-visible:outline-offset-2`;

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Amplop digital"
        description="Tamu bisa mengirim hadiah uang lewat transfer, atau mengirim kado ke alamat kalian."
      />

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-brand-line bg-brand-cream p-4 sm:p-6" aria-labelledby="rekening-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="rekening-heading" className="font-bold">Rekening & e-wallet</h2>
              <p className="mt-1 text-sm text-brand-muted">Tamu bisa menyalin nomornya langsung dari undangan.</p>
            </div>
            <button type="button" onClick={openAdd} className={cmsPrimaryButton}>
              <IconPlus size={18} aria-hidden="true" />
              Tambah rekening
            </button>
          </div>

          {gifts.length === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-brand-line bg-white px-6 py-8 text-center">
              <BrandCharacter character="gift" className="w-24" />
              <p className="mt-3 font-bold">Belum ada rekening</p>
              <p className="mt-1 max-w-xs text-sm text-brand-muted">
                Tambahkan rekening bank atau e-wallet untuk menerima amplop.
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-3">
              {gifts.map((gift) => {
                const bank = getBankOption(gift);
                const palette = getBankPalette(bank?.color);
                const bankLabel = bank?.name ?? gift.bankName;
                return (
                  <li
                    key={gift.id}
                    className="flex items-center justify-between gap-3 rounded-xl border p-3 sm:p-4"
                    style={{ backgroundColor: palette.tint, borderColor: palette.border }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {bank?.icon ? (
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-brand-line bg-white">
                          <Image src={bank.icon} alt="" fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div
                          className={`grid size-11 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                            bank ? "" : "bg-white text-brand-muted"
                          }`}
                          style={bank ? { backgroundColor: palette.soft, color: palette.text } : undefined}
                          aria-hidden="true"
                        >
                          {bank ? bank.code.slice(0, 3).toUpperCase() : gift.bankName?.slice(0, 3).toUpperCase() ?? "---"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{bankLabel}</p>
                        <p className="text-base tabular-nums">{gift.bankNumber}</p>
                        <p className="truncate text-xs text-brand-muted">a.n. {gift.name}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(gift)}
                        aria-label={`Edit rekening ${bankLabel}`}
                        className={`${iconAction} hover:bg-white`}
                      >
                        <IconEdit size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedGift(gift); setIsOpenDelete(true); }}
                        aria-label={`Hapus rekening ${bankLabel}`}
                        className={`${iconAction} text-brand-rose hover:bg-white`}
                      >
                        <IconTrash size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <CmsSection title="Alamat penerima kado" description="Untuk tamu yang ingin mengirim kado fisik.">
          <CmsField label="Nama penerima" htmlFor="name_address">
            <Input
              id="name_address"
              value={name_address}
              onChange={(e) => setNameAddress(e.target.value)}
              autoComplete="name"
              className={cmsInput}
            />
          </CmsField>
          <CmsField label="Nomor telepon" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={cmsInput}
            />
          </CmsField>
          <CmsField label="Alamat lengkap" htmlFor="address" hint="Jalan, nomor rumah, kecamatan, kota, dan kode pos.">
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              className={cmsTextarea}
            />
          </CmsField>
          <div>
            <button type="button" onClick={handleSaveAddress} disabled={isSavingAddress} className={cmsPrimaryButton}>
              {isSavingAddress ? (
                <><IconLoader2 size={18} className="animate-spin" aria-hidden="true" />Menyimpan…</>
              ) : (
                "Simpan alamat"
              )}
            </button>
          </div>
        </CmsSection>
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
            <DialogTitle>{selectedGift ? "Edit rekening" : "Tambah rekening"}</DialogTitle>
            <DialogDescription>
              {selectedGift ? "Ubah data rekening bank atau e-wallet." : "Tambahkan rekening bank atau e-wallet baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <CmsField label="Bank / e-wallet" htmlFor="bank">
              {banks.length > 0 ? (
                <Select
                  value={form.bankId || findBankOption(form.bankId, form.bankName)?.id || ""}
                  onValueChange={(val) => {
                    const bank = banks.find((item) => item.id === val);
                    setForm((f) => ({ ...f, bankId: val, bankName: bank?.name ?? f.bankName }));
                  }}
                >
                  <SelectTrigger id="bank" className="h-11! w-full rounded-xl border-brand-line bg-white text-brand-ink">
                    <SelectValue placeholder="Pilih bank atau e-wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex items-center gap-2">
                          {bank.icon ? (
                            <div className="relative size-5 shrink-0">
                              <Image src={bank.icon} alt="" fill className="object-contain" />
                            </div>
                          ) : (
                            <div className={`grid size-5 shrink-0 place-items-center rounded text-[10px] font-bold ${
                              bank.color ? "" : "bg-muted text-muted-foreground"
                            }`} style={bank.color ? {
                              backgroundColor: getBankPalette(bank.color).soft,
                              color: getBankPalette(bank.color).text,
                            } : undefined}>
                              {bank.code.slice(0, 2).toUpperCase()}
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
                  id="bank"
                  placeholder="Nama bank atau e-wallet"
                  value={form.bankName}
                  onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                  className={cmsInput}
                />
              )}
            </CmsField>

            <CmsField label="Nomor rekening / e-wallet" htmlFor="bank-number">
              <Input
                id="bank-number"
                inputMode="numeric"
                placeholder="0812345678"
                value={form.bankNumber}
                onChange={(e) => setForm((f) => ({ ...f, bankNumber: e.target.value }))}
                className={cmsInput}
              />
            </CmsField>

            <CmsField label="Nama pemilik rekening" htmlFor="bank-owner" hint="Sesuai yang tertulis di rekening.">
              <Input
                id="bank-owner"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={cmsInput}
              />
            </CmsField>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button type="button" className={cmsSecondaryButton} onClick={() => setIsOpenForm(false)}>
              Batal
            </button>
            <button
              type="button"
              className={cmsPrimaryButton}
              onClick={handleSubmit}
              disabled={isBusy || (!form.bankId && !form.bankName) || !form.bankNumber || !form.name}
            >
              {isBusy ? (
                <><IconLoader2 size={18} className="animate-spin" aria-hidden="true" />Menyimpan…</>
              ) : (
                "Simpan rekening"
              )}
            </button>
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
              className="bg-brand-rose hover:bg-brand-rose/90"
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
