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
    const expiresIn = getExpiresIn();
    if (expiresIn && new Date(expiresIn) < new Date()) {
      removeAuth();
      router.push("/auth/login");
    }
  }, [isAuthenticated, getExpiresIn]);
}