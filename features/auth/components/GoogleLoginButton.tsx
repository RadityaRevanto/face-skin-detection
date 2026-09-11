"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { customToast } from "@/lib/custom-toast";

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptNotification = {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
          }) => void;
          prompt: (listener?: (notification: GooglePromptNotification) => void) => void;
        };
      };
    };
  }
}

/** Icon Google 4 warna resmi (SVG inline — tidak butuh asset eksternal). */
function GoogleIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z'
        fill='#EA4335'
      />
    </svg>
  );
}

function GoogleLoginContent() {
  const router = useRouter();
  const [isGsiReady, setIsGsiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const callbackRef = useRef<(response: GoogleCredentialResponse) => void>(() => {});

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const handleSuccess = useCallback(
    async (credentialResponse: GoogleCredentialResponse) => {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const idToken = credentialResponse.credential;
        if (!idToken) throw new Error("Token tidak valid.");

        const response = await authService.google(idToken);

        if (!response.data?.user || !response.data?.token) {
          setErrorMsg("Gagal masuk menggunakan akun Google.");
          return;
        }

        // Login response tidak menyertakan role — ambil dari GET /profile.
        const profile = await authService.me();

        if (!profile.data) {
          setErrorMsg("Gagal memuat profil pengguna.");
          return;
        }

        const emailVerified = Boolean(profile.data.email_verified);

        // Verifikasi email hanya diwajibkan untuk role user (konsisten LoginView).
        if (!emailVerified && profile.data.role === "user") {
          router.push(`/verify-email?email=${encodeURIComponent(profile.data.email)}`);
          return;
        }

        customToast.success("Selamat datang!", {
          description: "Login berhasil. Selamat datang kembali!",
        });

        if (profile.data.role === "admin") {
          router.push("/admin/dashboard");
          return;
        }

        if (profile.data.role === "doctor") {
          if (profile.data.verification_status === "approved") {
            router.push("/doctor/dashboard");
          } else {
            router.push("/doctor/verification-status");
          }
          return;
        }

        router.push("/user/home");
      } catch (err: unknown) {
        setErrorMsg(getUserFriendlyErrorMessage(err) || "Gagal login dengan Google.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Callback selalu via ref agar closure state terbaru — disinkron di effect.
  useEffect(() => {
    callbackRef.current = handleSuccess;
  }, [handleSuccess]);

  useEffect(() => {
    if (!isGsiReady || !clientId || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => callbackRef.current(response),
    });
  }, [isGsiReady, clientId]);

  const handleCustomButtonClick = useCallback(() => {
    if (!window.google) {
      setErrorMsg("Google belum siap. Coba sesaat lagi.");
      return;
    }
    setErrorMsg("");
    window.google.accounts.id.prompt((notification) => {
      // Prompt disembunyikan Google (cooldown/suppressed) — beri tahu user.
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        setErrorMsg(
          "Popup Google tidak dapat ditampilkan. Coba lagi atau gunakan email & password.",
        );
      }
    });
  }, []);

  return (
    <div className='flex w-full flex-col items-center'>
      {errorMsg && (
        <div className='mb-3 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700'>
          {errorMsg}
        </div>
      )}

      {/* Tombol custom — styling senada form login */}
      <button
        type='button'
        onClick={handleCustomButtonClick}
        disabled={isLoading || !isGsiReady}
        className='flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isLoading ? (
          <Loader2 className='h-5 w-5 animate-spin text-emerald-600' />
        ) : (
          <GoogleIcon />
        )}
        {isLoading ? "Memproses..." : "Masuk dengan Google"}
      </button>

      {!isGsiReady && (
        <p className='mt-2 text-xs text-zinc-400'>Menyiapkan Google...</p>
      )}

      {/* Google Identity Services — dibutuhkan untuk One Tap prompt */}
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onReady={() => setIsGsiReady(true)}
      />
    </div>
  );
}

export function GoogleLoginButton() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  if (!clientId) return null;

  return <GoogleLoginContent />;
}
