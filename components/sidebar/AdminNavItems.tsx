import { ROUTES } from "@/lib/constants";
import type { SidebarNavItem } from "@/components/sidebar/Sidebar";
import { NavIcon, navIconStroke as s } from "./NavIcon";

export function getAdminNavItems(pendingCount: number): SidebarNavItem[] {
  return [
    {
      label: "Dashboard",
      href: ROUTES.ADMIN.DASHBOARD,
      icon: (
        <NavIcon>
          <path d="M4 11.5 12 5l8 6.5" {...s} />
          <path d="M6.5 10.5V19h11v-8.5" {...s} />
          <path d="M10 19v-5h4v5" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Users",
      href: ROUTES.ADMIN.USERS,
      icon: (
        <NavIcon>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...s} />
          <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...s} />
          <path d="M20 19c0-1.7-1-3.1-2.5-3.7" {...s} />
          <path d="M15.5 5.3a3 3 0 0 1 0 5.4" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Doctors",
      href: ROUTES.ADMIN.DOCTORS,
      icon: (
        <NavIcon>
          <path d="M7 4v5a5 5 0 0 0 10 0V4" {...s} />
          <path d="M7 4H5" {...s} />
          <path d="M17 4h2" {...s} />
          <path d="M12 14v2a4 4 0 0 0 8 0v-1" {...s} />
          <path d="M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Verification",
      href: ROUTES.ADMIN.DOCTOR_VERIFICATIONS,
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
      icon: (
        <NavIcon>
          <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" {...s} />
          <path d="m9 12 2 2 4-4" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Activity Logs",
      href: ROUTES.ADMIN.ACTIVITY_LOG,
      icon: (
        <NavIcon>
          <path d="M3 12a9 9 0 1 0 3-6.7" {...s} />
          <path d="M3 4v5h5" {...s} />
          <path d="M12 7v5l3 2" {...s} />
        </NavIcon>
      ),
    },
  ];
}
