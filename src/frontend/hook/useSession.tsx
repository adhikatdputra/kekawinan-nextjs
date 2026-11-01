import { useEffect } from "react";
import { useAuth } from "@/frontend/composable/useAuth";
import { useRouter } from "next/navigation";
import authApi from "@/frontend/api/auth";

const ACTIVITY_KEY = "kekawinan:last-activity";

// Tells the server the user is active today, at most once per day per browser,
// so the admin "Login hari ini" count includes saved sessions. Keyed on the
// WIB date because that's the day the server counts in.
function recordDailyActivity() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  try {
    if (localStorage.getItem(ACTIVITY_KEY) === today) return;
    localStorage.setItem(ACTIVITY_KEY, today);
  } catch {
    return;
  }
  authApi.recordActivity().catch(() => localStorage.removeItem(ACTIVITY_KEY));
}

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
      return;
    }
    if (isAuthenticated()) recordDailyActivity();
  }, [isAuthenticated, getExpiresIn]);
}