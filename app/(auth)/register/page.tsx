import type { Metadata } from "next";

import { RegisterView } from "@/src/features/auth/components/RegisterView";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Register",
  description: "Daftar akun baru",
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return <RegisterView />;
}
