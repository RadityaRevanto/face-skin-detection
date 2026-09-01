import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordView } from "@/features/auth/components/ResetPasswordView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset password akun Anda dengan OTP",
};

export default function ResetPasswordPage() {
  return (
    <RedirectIfAuthenticated>
      <Suspense>
        <ResetPasswordView />
      </Suspense>
    </RedirectIfAuthenticated>
  );
}
