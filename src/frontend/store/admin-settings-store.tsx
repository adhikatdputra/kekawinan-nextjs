import { useMutation } from "@tanstack/react-query";
import settingsApi from "../api/admin/settings";
import { toast } from "react-hot-toast";

export default function AdminSettingsStore() {
  const update = useMutation({
    mutationFn: (body: Record<string, string>) => settingsApi.update(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Settings berhasil diperbarui");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Gagal memperbarui settings");
    },
  });

  return { update };
}
