import { useEffect } from "react";
import { useAuth } from "@/frontend/composable/useAuth";
import { useRouter } from "next/navigation";

export default function useSession() {
  const { isAuthenticated, getExpiresIn, removeAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      removeAuth();
      router.push("/auth/login");
    }
    if (Number(getExpiresIn()) < new Date().getTime()) {
      removeAuth();
      router.push("/auth/login");
    }
  }, [isAuthenticated, getExpiresIn]);
}