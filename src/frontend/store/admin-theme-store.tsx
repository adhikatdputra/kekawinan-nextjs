import { useMutation } from "@tanstack/react-query";
import themeApi, { ThemeBody } from "../api/admin/theme";
import { toast } from "react-hot-toast";

export default function AdminThemeStore() {
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ThemeBody }) =>
      themeApi.update(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tema berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tema gagal diupdate");
    },
  });

  const create = useMutation({
    mutationFn: (body: ThemeBody) => themeApi.create(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tema berhasil dibuat");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tema gagal dibuat");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => themeApi.remove(id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tema berhasil dihapus");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tema gagal dihapus");
    },
  });

  return { update, create, remove };
}
