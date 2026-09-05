"use client";

import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function DoctorLogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-70"
    >
      {isLoggingOut ? "Keluar..." : "Logout & Kembali ke Login"}
    </button>
  );
}
