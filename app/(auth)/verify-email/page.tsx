import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailView } from "@/features/auth/components/VerifyEmailView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Verifikasi email Anda dengan kode OTP",
};

export default function VerifyEmailPage() {
  return (
    <RedirectIfAuthenticated>
      <Suspense>
        <VerifyEmailView />
      </Suspense>
    </RedirectIfAuthenticated>
  );
}
