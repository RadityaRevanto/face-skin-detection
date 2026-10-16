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
          <path d="M10 2h4" {...s} />
          <path d="M10 2v3.5L8.5 8v11a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3V8L14 5.5V2" {...s} />
          <path d="M8.5 13h7" {...s} />
        </NavIcon>
      ),
    },
    {
      label: "Rekomendasi",
      href: ROUTES.DOCTOR.RECOMMENDATIONS,
      icon: (
        <NavIcon>
          <path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7l-6 6Z" {...s} />
          <path d="m8 9 7 7" {...s} />
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
