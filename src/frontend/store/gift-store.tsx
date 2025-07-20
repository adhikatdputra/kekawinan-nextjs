import { useMutation } from "@tanstack/react-query";
import giftApi from "../api/gift";
import { toast } from "react-hot-toast";

export default function GiftStore() {
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      giftApi.update(id, data),
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
    mutationFn: (formData: FormData) => giftApi.create(formData),
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
    mutationFn: (id: string) => giftApi.remove(id),
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
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
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
