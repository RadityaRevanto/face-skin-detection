import type { Metadata } from "next";

import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Login | Face Skin Detection",
  description: "Login ke akun Anda",
};

export default function LoginPage() {
  return <LoginView />;
}
