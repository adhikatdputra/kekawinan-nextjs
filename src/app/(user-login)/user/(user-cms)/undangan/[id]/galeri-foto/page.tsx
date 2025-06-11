"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import undanganGaleriApi from "@/frontend/api/undangan-galeri";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UndanganGaleri } from "@/frontend/interface/undangan";
import Image from "next/image";
import MenuAction from "@/components/ui/custom/menu-action";
import TablePending from "@/components/ui/custom/table-pending";
import TableNoData from "@/components/ui/custom/table-no-data";

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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GaleriFotoPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [image, setImage] = useState<File | null>(null);
  const [tableData, setTableData] = useState<UndanganGaleri[]>([]);
  const [selectedItem, setSelectedItem] = useState<UndanganGaleri | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const {
    data: undanganGaleri,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["undangan-galeri", id],
    queryFn: () => undanganGaleriApi.getData(id),
    select: (data) => data.data.data,
  });

  const { mutate: createUndanganGaleri, isPending: isCreating } = useMutation({
    mutationFn: (formData: FormData) => undanganGaleriApi.create(formData),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        setIsOpenCreate(false);
        setImage(null);
        toast.success("Data berhasil dibuat");
        refetch();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Data gagal dibuat");
    },
  });

  const { mutate: deleteUndanganGaleri, isPending: isPendingDelete } =
    useMutation({
      mutationFn: (id: string) => undanganGaleriApi.remove(id),
      onSuccess: (data) => {
        const response = data.data;
        if (response.success) {
          toast.success("Data berhasil dihapus");
          refetch();
        } else {
          toast.error(response.message);
        }
      },
    });

  const handleDeleteFoto = () => {
    deleteUndanganGaleri(selectedItem?.id as string);
  };

  const handleUpdateUndanganGaleri = () => {
    const formData = new FormData();
    formData.append("undangan_id", id);
    formData.append("image", image as unknown as File);
    createUndanganGaleri(formData);
  };

  useEffect(() => {
    if (undanganGaleri) {
      setTableData(undanganGaleri.rows);
    }
  }, [undanganGaleri]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Galeri Foto</h1>
        <p>
          Upload maksimal 6 foto terbaik dengan pasanganmu untuk section gallery
          di undangan kamu
        </p>
      </div>
      {tableData.length < 6 && !isOpenCreate && (
        <div>
          <Button onClick={() => setIsOpenCreate(true)}>Tambah Foto</Button>
        </div>
      )}
      {isOpenCreate && (
        <div className="flex flex-col gap-6 bg-green-soft-kwn p-4 rounded-md">
          <div className="grid gap-2">
            <Label htmlFor="image">Upload Foto</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="cursor-pointer bg-white"
            />
            <p className="text-sm text-muted-foreground">
              Format file yang diizinkan: PNG, JPG, JPEG, GIF, dan WEBP. Ukuran
              maksimal 1MB.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateUndanganGaleri}
              disabled={isCreating || !image}
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Foto</span>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpenCreate(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}
      <div>
        <Table>
          <TableCaption>Maksimal 6 foto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TablePending colSpan={2} />
            ) : tableData.length > 0 ? (
              tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt="Gambar"
                      width={400}
                      height={400}
                      className="w-[160px] rounded-md"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <MenuAction
                      handleDelete={() => {
                        setIsOpenDelete(true);
                        setSelectedItem(item);
                      }}
                      items={["Hapus"]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData colSpan={2} />
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Foto
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-black font-normal">
              Apakah kamu yakin ingin menghapus foto ?
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
              onClick={handleDeleteFoto}
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
