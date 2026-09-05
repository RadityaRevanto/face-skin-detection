"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { DashboardRole } from "./AppShell";

type ProfileDropdownProps = {
  displayName: string;
  avatarUrl?: string | null;
  role: DashboardRole;
};

export function ProfileDropdown({ displayName, avatarUrl, role }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
  }

  const profileHref = role === "admin" ? "/admin/profile" : role === "doctor" ? "/doctor/profile" : "/user/profile";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span className="hidden text-sm font-medium text-slate-700 md:block">{displayName}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={`hidden h-4 w-4 text-slate-400 transition-transform md:block ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <div className="border-b border-slate-100 px-3 py-2.5">
              <p className="text-sm font-bold text-slate-900">{displayName}</p>
            </div>
            <Link
              href={profileHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
