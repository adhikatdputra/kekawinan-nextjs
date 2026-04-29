import { useMutation } from "@tanstack/react-query";
import giftApi from "../api/gift";
import { toast } from "react-hot-toast";

export default function GiftStore() {
  const update = useMutation({
    mutationFn: ({ undanganId, id, data }: { undanganId: string; id: string; data: object }) =>
      giftApi.update(undanganId, id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Kado berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Kado gagal diupdate");
    },
  });

  const create = useMutation({
    mutationFn: ({ undanganId, data }: { undanganId: string; data: object }) =>
      giftApi.create(undanganId, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Kado berhasil dibuat");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Kado gagal dibuat");
    },
  });

  const remove = useMutation({
    mutationFn: ({ undanganId, id }: { undanganId: string; id: string }) =>
      giftApi.remove(undanganId, id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Kado berhasil dihapus");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Kado gagal dihapus");
    },
  });

  const confirm = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      giftApi.confirm(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Kado berhasil dikonfirmasi");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Kado gagal dikonfirmasi");
    },
  });

  return { update, create, remove, confirm };
}
