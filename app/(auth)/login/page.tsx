import type { Metadata } from "next";

import { LoginView } from "@/src/features/auth/components/LoginView";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Login",
  description: "Login ke akun Anda",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginView />;
}
