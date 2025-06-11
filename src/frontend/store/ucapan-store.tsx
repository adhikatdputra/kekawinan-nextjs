import { useMutation } from "@tanstack/react-query";
import undanganUcapanApi from "../api/undangan-ucapan";
import { toast } from "react-hot-toast";

export default function UcapanStore() {
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      undanganUcapanApi.update(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Ucapan berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Ucapan gagal diupdate");
    },
  });

  const updateIsShow = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { is_show: string } }) =>
      undanganUcapanApi.changeShow(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Ucapan berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Ucapan gagal diupdate");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => undanganUcapanApi.remove(id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Ucapan berhasil dihapus");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Ucapan gagal dihapus");
    },
  });

  return { update, updateIsShow, remove };
}
