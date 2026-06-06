"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminProfileMenu() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Admin");
  const [initials, setInitials] = useState("AU");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const name =
        profile?.full_name ??
        user.email?.split("@")[0] ??
        "Admin";

      setDisplayName(name);
      setInitials(getInitials(name) || "AU");
    }

    void loadProfile();
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="h-11 w-11 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-100"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          {initials}
        </span>
      </Button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/70"
        >
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">Masuk sebagai</p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {displayName}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60"
          >
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
