"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { IconLoader2 } from "@tabler/icons-react";
import useLogin from "@/frontend/store/auth-store";
import { toast } from "react-hot-toast";

// Minimal typing for the Google Identity Services token client. The token client
// (instead of GIS's own rendered button) lets us style the button like our inputs.
interface GoogleTokenClient {
  requestAccessToken: () => void;
}

interface GoogleIdentity {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (response: { access_token?: string; error?: string }) => void;
        error_callback?: (error: { type: string }) => void;
      }) => GoogleTokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function GoogleSignInButton({ mode }: { mode: "login" | "register" }) {
  const { googleLogin } = useLogin();
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && !!window.google?.accounts?.oauth2
  );
  // Keep the latest mutate in a ref so the token client created once never goes stale
  const mutateRef = useRef(googleLogin.mutate);
  mutateRef.current = googleLogin.mutate;

  if (!GOOGLE_CLIENT_ID) return null;

  const handleClick = () => {
    if (!window.google) return;
    tokenClientRef.current ??= window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (response) => {
        if (response.access_token) mutateRef.current(response.access_token);
        else if (response.error !== "access_denied") toast.error("Login dengan Google gagal. Coba lagi.");
      },
      error_callback: (error) => {
        // Closing the popup is the user's choice, not an error worth a toast
        if (error.type !== "popup_closed") toast.error("Popup Google tidak bisa dibuka. Cek pemblokir popup di browser.");
      },
    });
    // Must run inside the click handler, otherwise browsers block the popup
    tokenClientRef.current.requestAccessToken();
  };

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={!scriptReady || googleLogin.isPending}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus"
      >
        {googleLogin.isPending ? (
          <>
            <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
            Memproses…
          </>
        ) : (
          <>
            <GoogleLogo />
            {mode === "register" ? "Daftar dengan Google" : "Masuk dengan Google"}
          </>
        )}
      </button>
      <div className="my-5 flex items-center gap-3 text-xs text-brand-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-brand-line" />
        atau pakai email
        <span className="h-px flex-1 bg-brand-line" />
      </div>
    </div>
  );
}
