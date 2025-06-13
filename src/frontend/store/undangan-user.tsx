import { useMutation } from "@tanstack/react-query";
import undanganUserApi from "../api/undangan-user";
import { toast } from "react-hot-toast";

export default function UndanganUserStore() {
  const getUndangan = useMutation({
    mutationFn: (slug: string) =>
      undanganUserApi.getUndangan(slug),
    onSuccess: (data) => {
      const response = data.data;
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
    onError: () => {
      toast.error("Error saat mengambil data undangan");
    },
  });

  const getTamu = useMutation({
    mutationFn: (id_tamu: string) =>
      undanganUserApi.getTamu(id_tamu),
    onSuccess: (data) => {
      const response = data.data;
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
    onError: () => {
      toast.error("Error saat mengambil data tamu");
    },
  });

  const createUcapan = useMutation({
    mutationFn: (formData: FormData) =>
      undanganUserApi.createUcapan(formData),
    onSuccess: (data) => {
      const response = data.data;
      if (!response.success) {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Error saat mengirim ucapan");
    },
  });

  const changeStatusUcapan = useMutation({
    mutationFn: (id_tamu: string) =>
      undanganUserApi.changeStatusUcapan(id_tamu),
    onSuccess: (data) => {
      const response = data.data;
      if (!response.success) {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Error saat mengubah status ucapan");
    },
  });

  return { getUndangan, getTamu, createUcapan, changeStatusUcapan };
}
