import { useMutation } from "@tanstack/react-query";
import usersApi from "../api/admin/users";
import { toast } from "react-hot-toast";

export default function AdminUsersStore() {
  const create = useMutation({
    mutationFn: (data: {
      email: string;
      fullname: string;
      password: string;
      level: string;
    }) => usersApi.createUser(data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("User berhasil dibuat");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("User gagal dibuat");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("User berhasil diupdate");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("User gagal diupdate");
    },
  });

  return { create, update };
}
