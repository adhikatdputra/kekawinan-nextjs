import { useMutation } from "@tanstack/react-query";
import themeApi, { ThemeBody } from "../api/admin/theme";
import { toast } from "react-hot-toast";

// The API unstars the oldest featured theme once there are more than FEATURED_THEME_LIMIT (10)
function notifyUnfeatured(names: string[] | undefined) {
  if (!names?.length) return;
  toast(`Bintang ${names.join(", ")} dilepas karena sudah ada 10 tema unggulan.`, {
    duration: 6000,
  });
}

export default function AdminThemeStore() {
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ThemeBody }) =>
      themeApi.update(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tema berhasil diupdate");
        notifyUnfeatured(response.data?.unfeatured);
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

  const featured = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      themeApi.setFeatured(id, isFeatured),
    onSuccess: (data, { isFeatured }) => {
      const response = data.data;
      if (response.success) {
        toast.success(isFeatured ? "Tema dijadikan unggulan" : "Tema tidak lagi unggulan");
        notifyUnfeatured(response.data?.unfeatured);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Gagal mengubah tema unggulan");
    },
  });

  return { update, create, remove, featured };
}
