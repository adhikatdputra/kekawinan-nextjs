import { useMutation } from "@tanstack/react-query";
import redeemCodesApi, { GenerateCodeBody } from "../api/admin/redeem-codes";
import { toast } from "react-hot-toast";

export default function AdminRedeemCodesStore() {
  const generate = useMutation({
    mutationFn: (body: GenerateCodeBody) => redeemCodesApi.generate(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Kode redeem berhasil dibuat");
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Gagal membuat kode redeem");
    },
  });

  return { generate };
}
