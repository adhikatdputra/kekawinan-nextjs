import { useMutation } from "@tanstack/react-query";
import bankApi from "../api/admin/bank";
import { toast } from "react-hot-toast";

export default function AdminBankStore() {
  const create = useMutation({
    mutationFn: (data: { name: string; code: string; icon?: string; color?: string }) =>
      bankApi.create(data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) toast.success("Bank berhasil ditambahkan");
      else toast.error(response.message);
    },
    onError: () => { toast.error("Bank gagal ditambahkan"); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; code?: string; icon?: string; color?: string } }) =>
      bankApi.update(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) toast.success("Bank berhasil diupdate");
      else toast.error(response.message);
    },
    onError: () => { toast.error("Bank gagal diupdate"); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => bankApi.remove(id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) toast.success("Bank berhasil dihapus");
      else toast.error(response.message);
    },
    onError: () => { toast.error("Bank gagal dihapus"); },
  });

  return { create, update, remove };
}
