import { ROUTES } from "@/lib/constants";
import type { SidebarNavItem } from "@/components/sidebar/Sidebar";
import { NavIcon, navIconStroke as s } from "./NavIcon";

export function getUserNavItems(): SidebarNavItem[] {
  return [
    {
      label: "Beranda",
      href: ROUTES.USER.DASHBOARD,
      icon: (
        <NavIcon>
          <path d="M3 10.7 12 3l9 7.7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.3Z" fill="currentColor" />
        </NavIcon>
      ),
    },
    {
      label: "Pemeriksaan",
      href: ROUTES.USER.SCAN,
      icon: (
        <NavIcon>
          <path d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "History",
      href: ROUTES.USER.HISTORY,
      icon: (
        <NavIcon>
          <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Skincare",
      href: ROUTES.USER.SKINCARE,
      icon: (
        <NavIcon>
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Konsultasi",
      href: ROUTES.USER.CONSULTATIONS,
      icon: (
        <NavIcon>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Premium",
      href: "/user/subscription",
      icon: (
        <NavIcon>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
        </NavIcon>
      ),
    },
    {
      label: "Device Tokens",
      href: ROUTES.USER.DEVICE_TOKENS,
      icon: (
        <NavIcon>
          <path d="M10 2h4m-2 0v2m0 0a4 4 0 104 4M10 2a4 4 0 00-4 4m6-4v2m0 0a4 4 0 104 4M10 2a4 4 0 00-4 4m12-2H8m12 6a4 4 0 11-8 0 4 4 0 018 0z" {...s} />
        </NavIcon>
      ),
    },
  ];
}
