import { useMutation } from "@tanstack/react-query";
import undanganTamuApi from "../api/undangan-tamu";
import { toast } from "react-hot-toast";

export default function TamuStore() {
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      undanganTamuApi.update(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tamu berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tamu gagal diupdate");
    },
  });

  const create = useMutation({
    mutationFn: (formData: FormData) => undanganTamuApi.create(formData),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tamu berhasil dibuat");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tamu gagal dibuat");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => undanganTamuApi.remove(id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Tamu berhasil dihapus");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Tamu gagal dihapus");
    },
  });

  const sendWhatsapp = useMutation({
    mutationFn: (id: string) => undanganTamuApi.sendWhatsapp(id),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Whatsapp berhasil dikirim");
      } else {
        toast.error(response.message);
      }
    },
  });

  return { update, create, remove, sendWhatsapp };
}
