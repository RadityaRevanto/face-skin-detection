import type { Metadata } from "next";

import { VerifyEmailView } from "@/src/features/auth/components/VerifyEmailView";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description: "Verifikasi email Anda dengan kode OTP",
};

export default async function VerifyEmailPage() {
  await redirectIfAuthenticated();

  return <VerifyEmailView />;
}
