import type { Metadata } from "next";

import { RegisterView } from "@/src/features/auth/components/register-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Register | Face Skin Detection",
  description: "Daftar akun baru",
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return <RegisterView />;
}
