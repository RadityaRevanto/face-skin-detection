"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createElement, useEffect, useState, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

function Icon({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return createElement(
    "svg",
    {
      "aria-hidden": true,
      viewBox: "0 0 24 24",
      fill: "none",
      className,
    },
    children
  );
}

function HomeIcon() {
  return createElement(
    Icon,
    { className: "h-4 w-4" },
    createElement("path", {
      d: "M3 10.7 12 3l9 7.7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.3Z",
      fill: "currentColor",
    })
  );
}

function CalendarIcon() {
  return createElement(
    Icon,
    { className: "h-4 w-4" },
    createElement("path", {
      d: "M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.8",
    })
  );
}

function ClockIcon() {
  return createElement(
    Icon,
    { className: "h-4 w-4" },
    createElement("path", {
      d: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.8",
    })
  );
}

function BellIcon() {
  return createElement(
    Icon,
    { className: "h-5 w-5 text-slate-500" },
    createElement("path", {
      d: "M18 9a6 6 0 1 0-12 0c0 7-2 7-2 7h16s-2 0-2-7Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.8",
    }),
    createElement("path", {
      d: "M10 19a2 2 0 0 0 4 0",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.8",
    })
  );
}

function ChevronDownIcon() {
  return createElement(
    Icon,
    { className: "h-4 w-4" },
    createElement("path", {
      d: "m6 9 6 6 6-6",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
    })
  );
}

function LogoutIcon() {
  return createElement(
    Icon,
    { className: "h-4 w-4" },
    createElement("path", {
      d: "M10 17l5-5-5-5M15 12H3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.8",
    }),
    createElement("path", {
      d: "M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.8",
    })
  );
}

function LogoMark() {
  return createElement(
    "svg",
    {
      "aria-hidden": true,
      className: "h-10 w-10",
      viewBox: "0 0 48 48",
      fill: "none",
    },
    createElement("path", {
      d: "M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z",
      fill: "#10B981",
    }),
    createElement("path", {
      d: "M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z",
      fill: "#047857",
    }),
    createElement("path", {
      d: "M12 31.5c6.6-8.1 13.5-14.4 24-20.4",
      stroke: "white",
      strokeWidth: "2",
      strokeLinecap: "round",
    })
  );
}

function Avatar() {
  return createElement(
    "div",
    {
      className:
        "relative h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-emerald-700 ring-2 ring-white",
      "aria-hidden": true,
    },
    createElement("div", {
      className:
        "absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-100",
    }),
    createElement("div", {
      className:
        "absolute bottom-0 left-1/2 h-7 w-8 -translate-x-1/2 rounded-t-full bg-emerald-800",
    })
  );
}

const navItems: NavItem[] = [
  { label: "Beranda", href: "/user/home", icon: createElement(HomeIcon) },
  {
    label: "Pemeriksaan",
    href: "/user/pemeriksaan",
    icon: createElement(CalendarIcon),
  },
  { label: "History", href: "/user/history", icon: createElement(ClockIcon) },
  // { label: "Tips", href: "/user/tips", icon: createElement(BulbIcon) },
];

export default function NavbarUsers() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Pengguna");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

      if (profile?.full_name) {
        setDisplayName(profile.full_name);
        return;
      }

      if (user.email) {
        setDisplayName(user.email.split("@")[0] ?? "Pengguna");
      }
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

  return createElement(
    "header",
    {
      className:
        "sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
    },
    createElement(
      "nav",
      {
        "aria-label": "Navigasi pengguna",
        className:
            "relative flex h-[72px] w-full items-center justify-between gap-6 px-10",
      },
      createElement(
        Link,
        { href: "/user/home", className: "flex shrink-0 items-center gap-3" },
        createElement(LogoMark),
        createElement(
          "span",
          { className: "flex flex-col leading-none" },
          createElement(
            "span",
            { className: "text-lg font-bold tracking-tight text-slate-900" },
            "SkinCheck"
          ),
          createElement(
            "span",
            { className: "text-sm font-semibold text-emerald-500" },
            "Health"
          )
        )
      ),
      createElement(
        "div",
        {
          className:
            "absolute left-1/2 hidden h-full -translate-x-1/2 items-center justify-center gap-8 md:flex",
        },
        navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return createElement(
            Link,
            {
              key: item.label,
              href: item.href,
              "aria-current": isActive ? "page" : undefined,
              className: [
                "relative flex h-full items-center gap-2 text-sm font-semibold transition-colors",
                isActive
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-emerald-600",
              ].join(" "),
            },
            item.icon,
            createElement("span", null, item.label),
            isActive
              ? createElement("span", {
                  className:
                    "absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 rounded-t-full bg-emerald-500",
                })
              : null
          );
        })
      ),
      createElement(
        "div",
        { className: "flex shrink-0 items-center gap-5" },
        createElement(
          "button",
          {
            type: "button",
            "aria-label": "Notifikasi",
            className:
              "grid h-10 w-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600",
          },
          createElement(BellIcon)
        ),
        createElement(
          "div",
          { className: "relative hidden sm:block" },
          createElement(
            "button",
            {
              type: "button",
              "aria-haspopup": "menu",
              "aria-expanded": isProfileOpen,
              onClick: () => setIsProfileOpen((value) => !value),
              className:
                "flex items-center gap-3 rounded-full py-1 pl-3 pr-1 transition-colors hover:bg-slate-50",
            },
            createElement(
              "span",
              { className: "text-sm font-medium text-slate-500" },
              "Halo, ",
              createElement(
                "strong",
                { className: "font-bold text-slate-700" },
                displayName
              )
            ),
            createElement(Avatar),
            createElement(
              "span",
              {
                className: [
                  "grid h-5 w-5 place-items-center text-slate-400 transition-transform",
                  isProfileOpen ? "rotate-180" : "",
                ].join(" "),
              },
              createElement(ChevronDownIcon)
            )
          ),
          isProfileOpen
            ? createElement(
                "div",
                {
                  role: "menu",
                  className:
                    "absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/70",
                },
                createElement(
                  "div",
                  { className: "border-b border-slate-100 px-3 py-3" },
                  createElement(
                    "p",
                    { className: "text-xs font-medium text-slate-500" },
                    "Masuk sebagai"
                  ),
                  createElement(
                    "p",
                    {
                      className:
                        "mt-1 truncate text-sm font-bold text-slate-800",
                    },
                    displayName
                  )
                ),
                createElement(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    disabled: isLoggingOut,
                    onClick: handleLogout,
                    className:
                      "mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60",
                  },
                  createElement(LogoutIcon),
                  isLoggingOut ? "Keluar..." : "Logout"
                )
              )
            : null
        )
      )
    )
  );
}