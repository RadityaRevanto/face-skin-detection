"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { customToast } from "@/lib/custom-toast";
import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

type GoogleCredentialResponse = {
  credential?: string;
};

function GoogleLoginContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
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
  };

  return (
    <div className="mb-4 flex flex-col items-center w-full">
      {errorMsg && (
        <div className="mb-3 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 text-center">
          {errorMsg}
        </div>
      )}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setErrorMsg("Login dibatalkan atau gagal.")}
          theme="outline"
          size="large"
          width="100%"
          text="signin_with"
          shape="rectangular"
        />
      </div>
      {isLoading && <p className="text-sm text-zinc-500 mt-2">Memproses login Google...</p>}
    </div>
  );
}

export function GoogleLoginButton() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLoginContent />
    </GoogleOAuthProvider>
  );
}
