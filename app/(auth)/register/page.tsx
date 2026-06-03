import type { Metadata } from "next";

import { RegisterView } from "@/components/auth/register-view";

export const metadata: Metadata = {
  title: "Register | Face Skin Detection",
  description: "Daftar akun baru",
};

export default function RegisterPage() {
  return <RegisterView />;
}