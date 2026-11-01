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
      if (data.data.success) {
        toast.success("Login berhasil");
        const expiresIn = new Date(user.exp_token * 1000).toISOString();
        setAuth(user, expiresIn);
        router.push("/user/undangan-list");
      } else {
        toast.error("Email/Password anda salah, silahkan coba lagi atau lupa password");
      }
    },
    onError: () => {
      toast.error("Email/Password anda salah, silahkan coba lagi atau lupa password");
    },
  });

  const googleLogin = useMutation({
    mutationFn: (accessToken: string) => authApi.loginWithGoogle(accessToken),
    onSuccess: (data) => {
      const user: User = data.data.data;
      if (data.data.success) {
        toast.success("Login berhasil");
        const expiresIn = new Date(user.exp_token * 1000).toISOString();
        setAuth(user, expiresIn);
        router.push("/user/undangan-list");
      } else {
        toast.error(data.data.message ?? "Login dengan Google gagal. Coba lagi.");
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      toast.error(
        axiosError?.response?.status === 403
          ? "Akun kamu sedang tidak aktif."
          : "Login dengan Google gagal. Coba lagi."
      );
    },
  });

  const logout = () => {
    toast.success("Logout berhasil");
    removeAuth();
    router.push("/");
  };

  return { login, googleLogin, logout };
}
