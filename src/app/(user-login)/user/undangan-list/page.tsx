"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/frontend/composable/useAuth";
import useSession from "@/frontend/hook/useSession";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconAdjustments,
  IconUsers,
  IconEdit,
  IconTrash,
  IconGift,
  IconTicket,
  IconRosetteDiscountCheckFilled,
  IconCoin,
  IconAlertTriangle,
  IconX,
  IconArrowRight,
  IconCrown,
  IconUserCheck,
  IconTool,
  IconExternalLink,
} from "@tabler/icons-react";
import PendingNoData from "@/components/ui/custom/pending-no-data";
import PendingData from "@/components/ui/custom/pending-data";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";

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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useQuery, useMutation } from "@tanstack/react-query";
import undanganApi from "@/frontend/api/undangan";
import creditsApi from "@/frontend/api/credits";
import redeemApi from "@/frontend/api/redeem";
import themeApi from "@/frontend/api/theme";
import authApi from "@/frontend/api/auth";
import { Undangan, UserCreditBalance, Theme, UndanganBody } from "@/frontend/interface/undangan";
import { Loader2, ShoppingBag } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function UndanganListPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenTrakteer, setIsOpenTrakteer] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Undangan | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [name, setName] = useState("");
  const [permalink, setPermalink] = useState("");

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenRedeem, setIsOpenRedeem] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [isOpenPhoneWarning, setIsOpenPhoneWarning] = useState(false);
  const [isIssueDismissed, setIsIssueDismissed] = useState(false);

  const { getUser, getUserName } = useAuth();
  const isAdmin = getUser()?.level === "admin" || getUser()?.level === "superadmin";

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: undangan, isLoading: isLoadingUndangan, refetch: refetchUndangan } = useQuery({
    queryKey: ["undangan-me", getUser()?.id],
    queryFn: () => undanganApi.getMyUndangan(),
    select: (data) => data.data.data.rows as Undangan[],
  });

  const { data: creditData, isLoading: isLoadingCredits, refetch: refetchCredits } = useQuery({
    queryKey: ["my-credits", getUser()?.id],
    queryFn: () => creditsApi.getMyCredits(),
    select: (data) => data.data.data as UserCreditBalance,
    enabled: !isAdmin,
  });

  const { data: themes, isLoading: isLoadingTheme } = useQuery({
    queryKey: ["themes-public"],
    queryFn: () => themeApi.getTheme(),
    select: (data) => data.data.data?.rows as Theme[],
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile-me"],
    queryFn: () => authApi.getMe(),
    select: (data) => data.data.data as { phone: string | null; fullname: string | null },
    enabled: !isAdmin,
  });

  // ── Derived values ────────────────────────────────────────────────────────────

  const hasPhone = !!(profileData?.phone);
  const balance = creditData?.balance ?? 0;

  // Harga efektif tema yang dipilih
  const effectiveCost = selectedTheme
    ? (selectedTheme.promo !== null && selectedTheme.promo !== undefined ? selectedTheme.promo : selectedTheme.credit)
    : 0;

  const canAfford = balance >= effectiveCost;

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const { mutate: updateUndangan, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UndanganBody }) =>
      undanganApi.updateUndangan(id, data),
    onSuccess: (data) => {
      if (data.data.success) {
        setIsOpen(false);
        setSelectedItem(null);
        toast.success("Undangan berhasil diubah");
        refetchUndangan();
      } else {
        toast.error(data.data.message);
      }
    },
  });

  const { mutate: createUndangan, isPending: isPendingCreate } = useMutation({
    mutationFn: (data: UndanganBody) => undanganApi.createUndangan(data),
    onSuccess: (data) => {
      if (data.data.success) {
        setIsOpen(false);
        setSelectedItem(null);
        setSelectedTheme(null);
        toast.success("Undangan berhasil dibuat");
        setIsOpenTrakteer(true);
        refetchUndangan();
        refetchCredits();
      } else {
        toast.error(data.data.message);
      }
    },
  });

  const { mutate: deleteUndangan, isPending: isPendingDelete } = useMutation({
    mutationFn: (id: string) => undanganApi.deleteUndangan(id),
  });

  const { mutate: doRedeem, isPending: isPendingRedeem } = useMutation({
    mutationFn: (code: string) => redeemApi.redeemCode(code),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success(data.data.message);
        setIsOpenRedeem(false);
        setRedeemCode("");
        refetchCredits();
      } else {
        toast.error(data.data.message);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Kode tidak valid");
    },
  });

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const isExpired = (expired: string) => new Date(expired) < new Date();

  const updatePermalink = (input: string) =>
    setPermalink(input.replace(/\s+/g, "-").replace(/[^\w-]+/g, "").toLowerCase());

  const openCreate = () => {
    if (!isAdmin && !hasPhone) {
      setIsOpenPhoneWarning(true);
      return;
    }
    setSelectedItem(null);
    setSelectedTheme(null);
    setName("");
    setPermalink("");
    setIsOpen(true);
  };

  const openEdit = (item: Undangan) => {
    setSelectedItem(item);
    setSelectedTheme(null);
    setName(item.name ?? "");
    setPermalink(item.permalink);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setSelectedTheme(null);
    setName("");
    setPermalink("");
  };

  const handleSubmit = () => {
    if (selectedItem) {
      updateUndangan({ id: selectedItem.id, data: { name, permalink } });
    } else {
      createUndangan({ name, permalink, themeId: selectedTheme?.id });
    }
  };

  const handleDeleteUndangan = () => {
    if (!selectedItem?.id) return;
    deleteUndangan(selectedItem.id, {
      onSuccess: () => {
        setIsOpenDelete(false);
        setSelectedItem(null);
        toast.success("Undangan berhasil dihapus");
        refetchUndangan();
      },
    });
  };

  useSession();
  useEffect(() => { setIsLoaded(true); }, []);

  const canCreate = selectedItem
    ? !!name && !!permalink
    : isAdmin
    ? !!name && !!permalink
    : !!name && !!permalink && !!selectedTheme && canAfford;

  return (
    <>
      {/* Hero */}
      <div className="bg-[url('/images/bg-main.jpg')] bg-cover bg-center h-[400px] flex items-end">
        <div className="container py-8 md:py-12">
          {isLoaded && (
            <>
              <h1 className="text-black text-3xl md:text-5xl font-bold">
                Halo... <br /> {getUserName()}
              </h1>
              <div className="mt-6 flex gap-3 flex-wrap items-center">
                {!isAdmin && (
                  <>
                    <Button variant="outline" size="lg" onClick={() => setIsOpenRedeem(true)}>
                      <IconTicket size={20} />
                      Tukar Kode
                    </Button>
                    <Button size="lg" onClick={openCreate}>
                      <IconPlus size={20} />
                      Buat Undangan
                    </Button>
                  </>
                )}
                {isAdmin && (
                  <Button size="lg" onClick={openCreate}>
                    <IconPlus size={20} />
                    Buat Undangan
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="py-12 max-w-[900px] mx-auto">
        <div className="container flex flex-col gap-10">

          {/* ── Credit Balance ──────────────────────────────────────────────── */}
          {!isAdmin && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Credit Kamu</h2>
              {isLoadingCredits ? (
                <PendingData />
              ) : balance > 0 ? (
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-soft-kwn flex items-center justify-center">
                      <IconCoin size={24} className="text-green-kwn" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-kwn leading-none">{balance}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">credit tersedia</p>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => setIsOpenRedeem(true)}>
                      <IconTicket size={16} />
                      Tukar Kode
                    </Button>
                    <Button onClick={openCreate}>
                      <IconPlus size={16} />
                      Buat Undangan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-10 border border-dashed border-border rounded-2xl text-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Belum punya credit</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Beli di Shopee, lalu tukar kode yang kamu dapat di sini.
                    </p>
                  </div>
                  <Button onClick={() => setIsOpenRedeem(true)}>
                    <IconTicket size={16} />
                    Tukar Kode
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Daftar Undangan ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Daftar Undangan</h2>
            {isLoadingUndangan ? (
              <PendingData />
            ) : (undangan?.length ?? 0) === 0 ? (
              <PendingNoData message="Kamu belum memiliki undangan" slot={null} />
            ) : (
              <div className="flex flex-col gap-4">
                {undangan?.map((item: Undangan) => {
                  const role = item.collaboratorRole ?? "OWNER";
                  const isOwner = role === "OWNER";

                  const roleConfig = {
                    OWNER: {
                      label: "Owner",
                      icon: IconCrown,
                      chip: "bg-amber-100 text-amber-700 border border-amber-200",
                      accent: "border-l-border",
                    },
                    MEMBER: {
                      label: "Member",
                      icon: IconUserCheck,
                      chip: "bg-blue-50 text-blue-600 border border-blue-200",
                      accent: "border-l-border",
                    },
                    CREW: {
                      label: "Crew",
                      icon: IconTool,
                      chip: "bg-purple-50 text-purple-600 border border-purple-200",
                      accent: "border-l-border",
                    },
                  }[role] ?? {
                    label: role,
                    icon: IconCrown,
                    chip: "bg-gray-100 text-gray-600 border border-gray-200",
                    accent: "border-l-border",
                  };

                  const RoleIcon = roleConfig.icon;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border border-border border-l-4 ${roleConfig.accent} shadow-sm hover:shadow-md hover:bg-green-soft-kwn/20 transition-all duration-200 p-4`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        {/* Left: name + meta */}
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-base">{item.name}</span>
                            {isExpired(item.expired ?? "") && (
                              <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Expired</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Role chip */}
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${roleConfig.chip}`}>
                              <RoleIcon size={11} />
                              {roleConfig.label}
                            </span>
                            {!isOwner && item.invitedByName && (
                              <span className="text-xs text-muted-foreground">
                                · Diundang oleh <span className="font-medium">{item.invitedByName}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Divider — mobile only */}
                        <div className="border-t border-border sm:hidden" />

                        {/* Right: actions */}
                        <div className="flex items-center gap-1 shrink-0 flex-wrap">
                          {/* Preview link */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/${item.permalink}/demo`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs font-medium text-green-kwn border border-green-kwn/40 hover:bg-green-kwn hover:text-white px-2 py-1 rounded-lg transition-colors"
                              >
                                <IconExternalLink size={13} />
                                Preview
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent><p>Lihat undangan</p></TooltipContent>
                          </Tooltip>

                          {/* Divider */}
                          <div className="w-px h-5 bg-border mx-1" />

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/user/undangan/${item.id}/overview`} className="p-1.5 rounded-lg text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors">
                                <IconAdjustments size={17} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent><p>Dashboard undangan</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/user/undangan/${item.id}/tamu-undangan`} className="p-1.5 rounded-lg text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors">
                                <IconUsers size={17} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent><p>Tamu undangan</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/user/undangan/${item.id}/kado-pernikahan`} className="p-1.5 rounded-lg text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors">
                                <IconGift size={17} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent><p>Kado pernikahan</p></TooltipContent>
                          </Tooltip>

                          {isOwner && (
                            <>
                              <div className="w-px h-5 bg-border mx-1" />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                                    <IconEdit size={17} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Edit undangan</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button onClick={() => { setSelectedItem(item); setIsOpenDelete(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <IconTrash size={17} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Hapus undangan</p></TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Dialog: Tukar Kode ──────────────────────────────────────────────── */}
      <Dialog open={isOpenRedeem} onOpenChange={(open) => { setIsOpenRedeem(open); if (!open) setRedeemCode(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tukar Kode Redeem</DialogTitle>
            <DialogDescription>Masukkan kode yang kamu terima setelah pembelian di Shopee.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Kode Redeem</Label>
            <Input
              placeholder="KKW-GRAND-A1B2C3"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              className="font-mono tracking-widest"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setIsOpenRedeem(false); setRedeemCode(""); }}>Batal</Button>
            <Button onClick={() => doRedeem(redeemCode)} disabled={isPendingRedeem || !redeemCode.trim()}>
              {isPendingRedeem ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Menukar...</span></> : "Tukar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Buat / Edit Undangan ────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <form>
          <DialogContent className="sm:max-w-[750px] lg:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit" : "Buat"} Undangan</DialogTitle>
              <Separator className="my-2" />
              <DialogDescription />
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Nama Undangan</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama undangan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="permalink">Permalink</Label>
                <Input
                  id="permalink"
                  placeholder="romeo-juliet"
                  value={permalink}
                  onChange={(e) => updatePermalink(e.target.value)}
                />
                <span className="text-sm font-semibold text-green-kwn">Contoh: romeo-juliet</span>
                <div className="mt-2 px-4 py-3 rounded-md bg-green-soft-kwn text-sm">
                  <p>https://kekawinan.com/{permalink}</p>
                </div>
              </div>

              {/* Theme picker — hanya saat buat baru (bukan edit) */}
              {!selectedItem && !isLoadingTheme && (themes?.length ?? 0) > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label>Pilih Tema</Label>
                      {!isAdmin && (
                        <span className="text-xs text-muted-foreground">
                          Credit kamu:{" "}
                          <span className="font-semibold text-green-kwn">{balance}</span>
                        </span>
                      )}
                    </div>
                    <Swiper
                      loop={false}
                      modules={[Navigation, Pagination]}
                      spaceBetween={24}
                      slidesPerView={1.5}
                      centeredSlides={true}
                      breakpoints={{
                        768: { slidesPerView: 3, centeredSlides: false },
                        1024: { slidesPerView: 3, centeredSlides: false },
                      }}
                      navigation={true}
                      pagination={{ clickable: true }}
                      className="w-full"
                      style={{
                        "--swiper-navigation-color": "#4A763E",
                        "--swiper-navigation-size": "32px",
                        "--swiper-pagination-color": "#4A763E",
                        "--swiper-pagination-bullet-size": "5px",
                        paddingBottom: "30px",
                      } as React.CSSProperties}
                    >
                      {themes?.map((item: Theme) => {
                        const cost = item.promo !== null && item.promo !== undefined ? item.promo : item.credit;
                        const affordable = isAdmin || balance >= cost;
                        const isSelected = selectedTheme?.id === item.id;

                        return (
                          <SwiperSlide key={item.id} className="w-full">
                            <button
                              type="button"
                              onClick={() => affordable && setSelectedTheme(item)}
                              className={`group relative w-full ${!affordable ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <div className={`relative rounded-md overflow-hidden ${isSelected ? "border-2 border-green-kwn" : ""}`}>
                                <Image
                                  src={item.thumbnail}
                                  alt={item.name}
                                  width={500}
                                  height={500}
                                  className="w-full"
                                />
                                {/* Badge harga credit */}
                                <div className="absolute top-2 left-2">
                                  {item.promo !== null && item.promo !== undefined ? (
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                                        {item.promo === 0 ? "GRATIS" : `${item.promo} credit`}
                                      </span>
                                      <span className="text-xs bg-black/60 text-white/70 px-1.5 py-0.5 rounded line-through">
                                        {item.credit} credit
                                      </span>
                                    </div>
                                  ) : (
                                    <span className={`text-xs bg-black/60 text-white px-1.5 py-0.5 rounded font-medium ${item.credit === 0 ? "bg-red-500" : "bg-green-kwn"}`}>
                                      {item.credit === 0 ? "GRATIS" : `${item.credit} credit`}
                                    </span>
                                  )}
                                </div>
                                {/* Badge dipilih */}
                                {isSelected && (
                                  <div className="absolute top-2 right-2">
                                    <div className="flex items-center gap-1 rounded-full bg-green-kwn px-2 py-1 text-white text-xs">
                                      <IconRosetteDiscountCheckFilled size={14} />
                                      <span>Dipilih</span>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <Link href={`/${item.componentName?.toLowerCase()}/demo`}>Preview</Link>
                                </div>
                              </div>
                            </button>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>

                    {/* Peringatan tidak cukup credit */}
                    {!isAdmin && selectedTheme && !canAfford && (
                      <p className="text-xs text-red-500">
                        Credit tidak cukup. Tema ini butuh {effectiveCost} credit, kamu punya {balance}.
                      </p>
                    )}
                    {!isAdmin && selectedTheme && canAfford && (
                      <p className="text-xs text-muted-foreground">
                        Sisa credit setelah buat undangan:{" "}
                        <span className="font-semibold text-foreground">{balance - effectiveCost}</span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <Separator className="my-2" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>Batal</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!canCreate || isPendingCreate || isPendingUpdate}
                onClick={handleSubmit}
              >
                {isPendingCreate || isPendingUpdate
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
                  : selectedItem ? "Simpan" : "Buat Undangan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* ── Dialog: Hapus ───────────────────────────────────────────────────── */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Hapus Undangan</AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus undangan{" "}
              <span className="font-semibold">{selectedItem?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsOpenDelete(false); setSelectedItem(null); }}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUndangan} disabled={isPendingDelete}>
              {isPendingDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog: Trakteer ────────────────────────────────────────────────── */}
      <Dialog open={isOpenTrakteer} onOpenChange={() => { setIsOpenTrakteer(false); window.open("https://trakteer.id/partnerinaja/tip", "_blank"); }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader><DialogTitle /><DialogDescription /></DialogHeader>
          <div className="md:px-8">
            <div className="text-center pb-5">
              <div className="text-3xl font-bold text-black">Selamat kamu berhasil membuat undangan!</div>
              <p className="pt-2">Yuk terus support kami agar dapat terus mengembangkan sistem ini</p>
            </div>
            <Link
              href="https://trakteer.id/partnerinaja/tip"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded-full"
              onClick={() => setIsOpenTrakteer(false)}
            >
              <Image src="https://cdn.trakteer.id/images/embed/trbtn-icon.png" alt="" width={100} height={100} className="w-[16px]" />
              <span>Dukung kami di Trakteer</span>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Peringatan Nomor HP ─────────────────────────────────────── */}
      <Dialog open={isOpenPhoneWarning} onOpenChange={setIsOpenPhoneWarning}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <IconAlertTriangle size={20} />
              Lengkapi Profil Kamu
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-4 py-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Kamu belum mengisi <strong>nomor WhatsApp</strong> di profil kamu.
              Nomor ini diperlukan agar tim Kekawinan bisa menghubungi kamu jika ada kendala terkait undanganmu.
            </p>
            <p className="text-xs text-muted-foreground">
              Silahkan lengkapi profil kamu terlebih dahulu sebelum membuat undangan.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpenPhoneWarning(false)}>
              Nanti
            </Button>
            <Link href="/user/profile">
              <Button className="flex items-center gap-2">
                Lengkapi Profil
                <IconArrowRight size={16} />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Issue Badge ─────────────────────────────────────────────────────── */}
      {isLoaded && !isAdmin && !hasPhone && !isIssueDismissed && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setIsOpenPhoneWarning(true)}
            className="flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
          >
            <IconAlertTriangle size={16} />
            1 Issue
          </button>
          <button
            onClick={() => setIsIssueDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
            title="Tutup"
          >
            <IconX size={11} />
          </button>
        </div>
      )}
    </>
  );
}
