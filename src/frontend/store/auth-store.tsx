import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth";
import { LoginBody } from "../interface/auth";
import { User } from "../interface/user";
import { useAuth } from "@/frontend/composable/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuthStore() {
  const { removeAuth, setAuth } = useAuth();
  const router = useRouter();

  const login = useMutation({
    mutationFn: (data: LoginBody) => authApi.login(data),
    onSuccess: (data) => {
      const user: User = data.data.data;
      console.log(user);
      if (data.data.success) {
        toast.success("Login berhasil");
        const expiresIn = new Date(user.exp_token * 1000).toISOString();
        setAuth(user, expiresIn);
        router.push("/user/undangan-list");
      } else {
        toast.error("Login gagal harap cek kembali email dan password");
      }
    },
    onError: () => {
      toast.error("Login gagal harap cek kembali email dan password");
    },
  });

  const logout = () => {
    toast.success("Logout berhasil");
    removeAuth();
    router.push("/");
  };

  return { login, logout };
}
