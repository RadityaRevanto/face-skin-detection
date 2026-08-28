"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { googleLoginAction } from "@/lib/auth/actions";

function GoogleLoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("Token tidak valid.");

      const result = await googleLoginAction(idToken);

      if (!result.success || !result.user) {
        setErrorMsg(result.message || "Gagal masuk menggunakan akun Google.");
        return;
      }

      const profile = result.user;

      if (profile.email_verified === false) {
        window.location.href = `/verify-email?email=${encodeURIComponent(profile.email)}`;
        return;
      }

      if (profile.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }

      if (profile.role === "doctor") {
        if (profile.verification_status === "approved") {
          window.location.href = "/doctor/dashboard";
        } else {
          window.location.href = "/doctor/verification-status";
        }
        return;
      }

      window.location.href = "/user/home";

    } catch (err: any) {
      setErrorMsg(err.message || "Gagal login dengan Google.");
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
