import type { Metadata } from "next";

import { ResetPasswordView } from "@/components/auth/reset-password-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Reset Password | Face Skin Detection",
  description: "Reset password akun Anda dengan OTP",
};

export default async function ResetPasswordPage() {
  await redirectIfAuthenticated();

  return <ResetPasswordView />;
}
