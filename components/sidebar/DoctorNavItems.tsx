import { ROUTES } from "@/lib/constants";
import type { SidebarNavItem } from "@/components/sidebar/Sidebar";
import { NavIcon, navIconStroke as s } from "./NavIcon";

export function getDoctorNavItems(): SidebarNavItem[] {
  return [
    {
      label: "Dashboard",
      href: ROUTES.DOCTOR.DASHBOARD,
      icon: (
        <NavIcon>
          <path d="M4 11.5 12 5l8 6.5" {...s} />
          <path d="M6.5 10.5V19h11v-8.5" {...s} />
          <path d="M10 19v-5h4v5" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Konsultasi",
      href: ROUTES.DOCTOR.CONSULTATIONS,
      icon: (
        <NavIcon>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Skincare",
      href: ROUTES.DOCTOR.SKINCARE,
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
      label: "Rekomendasi",
      href: ROUTES.DOCTOR.RECOMMENDATIONS,
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
      label: "Skin Concern",
      href: ROUTES.DOCTOR.SKIN_CONCERNS,
      icon: (
        <NavIcon>
          <path d="M4 7h16" {...s} />
          <path d="M4 12h10" {...s} />
          <path d="M4 17h7" {...s} />
          <path d="M17 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Skin Types",
      href: ROUTES.DOCTOR.SKIN_TYPES,
      icon: (
        <NavIcon>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" {...s} />
          <rect x="9" y="3" width="6" height="4" rx="1" {...s} />
          <path d="M9 14l2 2 4-4" {...s} />
        </NavIcon>
      ),
    },
  ];
}
