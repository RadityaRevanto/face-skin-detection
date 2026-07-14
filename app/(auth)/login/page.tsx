import type { Metadata } from "next";

import { LoginView } from "@/components/auth/login-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Login | Face Skin Detection",
  description: "Login ke akun Anda",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginView />;
}
