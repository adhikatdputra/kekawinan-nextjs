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
  IconRosetteDiscountCheckFilled,
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
import themeApi from "@/frontend/api/theme";
import { Undangan, Theme, UndanganBody } from "@/frontend/interface/undangan";
import { Loader2 } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function UndanganListPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenTrakteer, setIsOpenTrakteer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Undangan | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>("");
  const [name, setName] = useState("");
  const [permalink, setPermalink] = useState("");
  const { getUser, getUserName } = useAuth();

  const {
    data: undangan,
    isLoading: isLoadingUndangan,
    refetch: refetchUndangan,
  } = useQuery({
    queryKey: ["undangan-me"],
    queryFn: () => undanganApi.getUndangan(),
    select: (data) => data.data.data,
  });

  const { data: theme, isLoading: isLoadingTheme } = useQuery({
    queryKey: ["themes"],
    queryFn: () => themeApi.getTheme(),
    select: (data) => data.data.data?.rows,
  });

  const { mutate: updateUndangan, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UndanganBody }) =>
      undanganApi.updateUndangan(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        setIsOpen(false);
        setSelectedItem(null);
        toast.success("Undangan berhasil diubah");
        refetchUndangan();
      } else {
        toast.error(response.message);
      }
    },
  });

  const { mutate: createUndangan, isPending: isPendingCreate } = useMutation({
    mutationFn: (data: UndanganBody) => undanganApi.createUndangan(data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        setIsOpen(false);
        setSelectedItem(null);
        toast.success("Undangan berhasil dibuat");
        setIsOpenTrakteer(true);
        refetchUndangan();
      } else {
        toast.error(response.message);
      }
    },
  });

  const { mutate: deleteUndangan, isPending: isPendingDelete } = useMutation({
    mutationFn: (id: string) => undanganApi.deleteUndangan(id),
  });

  const isExpired = (expired: string) => {
    const today = new Date();
    const expiredDate = new Date(expired);
    return expiredDate < today;
  };

  const handleDeleteUndangan = () => {
    if (selectedItem?.id) {
      deleteUndangan(selectedItem.id, {
        onSuccess: () => {
          setIsOpenDelete(false);
          setSelectedItem(null);
          toast.success("Undangan berhasil dihapus");
          refetchUndangan();
        },
      });
    }
  };

  const updatePermalink = (input: string) => {
    const inputValue = input;
    const modifiedValue = inputValue
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .toLowerCase();

    setPermalink(modifiedValue);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      updateUndangan({ id: selectedItem.id, data: { name, permalink } });
    } else {
      createUndangan({ name, permalink, theme_id: selectedTheme });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setName("");
    setPermalink("");
    setSelectedTheme("");
  };

  useSession();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div className="bg-[url('/images/bg-main.jpg')] bg-cover bg-center h-[400px] flex items-end">
        <div className="container py-8 md:py-12">
          {isLoaded && (
            <>
              <h1 className="text-black text-3xl md:text-5xl font-bold">
                Halo... <br /> {getUserName()}
              </h1>
              {(getUser()?.level === "admin" ||
                (getUser()?.level !== "admin" && undangan?.length < 2)) && (
                <div className="mt-6">
                  <Button size="lg" onClick={() => setIsOpen(true)}>
                    <IconPlus size={20} />
                    Buat Undangan
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="py-12 max-w-[900px] mx-auto">
        <div className="container flex flex-col gap-6 md:gap-8">
          <h2 className="text-2xl font-bold">Daftar Undangan</h2>
          {isLoadingUndangan ? (
            <PendingData />
          ) : (
            <>
              {undangan?.length === 0 ? (
                <PendingNoData
                  message="Maaf, kamu belum memiliki undangan"
                  slot={
                    (getUser()?.level === "admin" ||
                      (getUser()?.level !== "admin" &&
                        undangan?.length < 2)) && (
                      <Button onClick={() => setIsOpen(true)}>
                        <IconPlus size={20} />
                        Buat Undangan
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="flex flex-col gap-6">
                  {undangan?.map((item: Undangan) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-xl p-4 border border-border hover:shadow-xl hover:bg-green-soft-kwn/40 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                          <Badge asChild className="bg-green-kwn text-white">
                            <Link
                              href={`/${item.permalink}/demo`}
                              target="_blank"
                            >
                              Lihat
                            </Link>
                          </Badge>
                          <div>
                            <div className="text-base">{item.name}</div>
                            {isExpired(item.expired) && (
                              <Badge asChild className="bg-red-600 text-white">
                                Expired
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger className="bg-green-kwn text-white p-1 rounded-sm">
                              <Link href={`/user/undangan/${item.id}/overview`}>
                                <IconAdjustments size={18} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Atur konten undangan kamu</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger className="bg-blue-600 text-white p-1 rounded-sm">
                              <Link href={`/user/undangan/${item.id}/tamu-undangan`}>
                                <IconUsers size={18} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tambah daftar tamu undangan</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger className="bg-yellow-600 text-white p-1 rounded-sm">
                              <IconEdit
                                size={18}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setName(item.name);
                                  setPermalink(item.permalink);
                                  setSelectedTheme(item.theme_id);
                                  setIsOpen(true);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit undangan kamu</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger className="bg-red-700 text-white p-1 rounded-sm">
                              <IconTrash
                                size={18}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsOpenDelete(true);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hapus undangan</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog Create / Edit Undangan */}
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <form>
          <DialogContent className="sm:max-w-[750px] lg:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit" : "Buat"} Undangan
              </DialogTitle>
              <Separator className="my-2" />
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Nama Undangan</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukan Nama Undangan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="permalink">Permalink</Label>
                <Input
                  id="permalink"
                  name="permalink"
                  placeholder="Masukan Permalink Undangan"
                  value={permalink}
                  onChange={(e) => updatePermalink(e.target.value)}
                />
                <span className="text-sm font-semibold text-green-kwn">
                  Contoh: romeo-juliet
                </span>

                <div className="mt-2 px-4 py-3 rounded-md bg-green-soft-kwn text-sm">
                  <p>https://kekawinan.com/{permalink}</p>
                </div>
              </div>
              {!selectedItem && (
                <>
                  <Separator className="my-2" />
                  <div className="grid gap-3">
                    <Label htmlFor="name">Pilih Tema</Label>
                    {!isLoadingTheme && theme?.length > 0 && (
                      <Swiper
                        loop={false}
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1.5}
                        centeredSlides={true}
                        breakpoints={{
                          768: {
                            slidesPerView: 3,
                            centeredSlides: false,
                          },
                          1024: {
                            slidesPerView: 3,
                            centeredSlides: false,
                          },
                        }}
                        navigation={true}
                        pagination={{
                          clickable: true,
                        }}
                        className="w-full"
                        style={
                          {
                            "--swiper-navigation-color": "#4A763E",
                            "--swiper-navigation-size": "32px",
                            "--swiper-pagination-color": "#4A763E",
                            "--swiper-pagination-bullet-size": "5px",
                            paddingBottom: "30px",
                          } as React.CSSProperties
                        }
                      >
                        {theme?.map((item: Theme) => (
                          <SwiperSlide key={item.id} className="w-full">
                            <button
                              onClick={() => setSelectedTheme(item.id)}
                              className="group relative"
                            >
                              <div
                                className={`relative rounded-md overflow-hidden ${
                                  selectedTheme === item.id
                                    ? "border-2 border-green-kwn"
                                    : ""
                                }`}
                              >
                                <Image
                                  src={item.thumbnail}
                                  alt={item.name}
                                  width={500}
                                  height={500}
                                  className="w-full"
                                />
                                <div
                                  className={`absolute top-4 right-4 ${
                                    selectedTheme === item.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 rounded-full bg-green-kwn px-2 py-1 text-white text-sm">
                                    <IconRosetteDiscountCheckFilled
                                      size={16}
                                      className="text-white"
                                    />{" "}
                                    <span>Dipilih</span>
                                  </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black text-white text-sm flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <Link
                                    href={`/${item.component_name.toLowerCase()}/demo`}
                                  >
                                    Preview
                                  </Link>
                                </div>
                              </div>
                            </button>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>
                </>
              )}
            </div>
            <Separator className="my-2" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
              </DialogClose>
              {selectedItem ? (
                <Button
                  type="submit"
                  disabled={!name || !permalink}
                  onClick={handleSubmit}
                >
                  {isPendingUpdate ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!name || !permalink || !selectedTheme}
                  onClick={handleSubmit}
                >
                  {isPendingCreate ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Buat Undangan"
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* Dialog Delete Undangan */}
      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Undangan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus undangan{" "}
              <span className="font-semibold">{selectedItem?.name}</span>?
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
              onClick={handleDeleteUndangan}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Ya, Hapus"
              )}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Trakteer */}
      <Dialog
        open={isOpenTrakteer}
        onOpenChange={() => {
          setIsOpenTrakteer(false);
          window.open("https://trakteer.id/partnerinaja/tip", "_blank");
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="md:px-8">
            <div className="text-center pb-5">
              <div className="text-3xl font-bold text-black">
                Selamat kamu berhasil membuat undangan!
              </div>
              <p className="pt-2">
                Yuk terus support kami agar dapat terus mengembangkan sistem ini
              </p>
            </div>
            <Link
              href="https://trakteer.id/partnerinaja/tip"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-2 rounded-full"
              onClick={() => setIsOpenTrakteer(false)}
            >
              <Image
                src="https://cdn.trakteer.id/images/embed/trbtn-icon.png"
                alt=""
                width={100}
                height={100}
                className="w-[16px]"
              />
              <span>Dukung kami di Trakteer</span>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
