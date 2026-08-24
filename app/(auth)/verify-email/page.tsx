import type { Metadata } from "next";

import { VerifyEmailView } from "@/components/auth/verify-email-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Verifikasi Email | Face Skin Detection",
  description: "Verifikasi email Anda dengan kode OTP",
};

export default async function VerifyEmailPage() {
  await redirectIfAuthenticated();

  return <VerifyEmailView />;
}
