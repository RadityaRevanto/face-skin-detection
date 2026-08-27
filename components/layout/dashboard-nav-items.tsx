import { ROUTES } from "@/lib/constants";
import type { SidebarNavItem } from "@/components/ui/sidebar";

function Icon({ children, viewBox = "0 0 24 24" }: { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} fill="none" className="h-5 w-5">
      {children}
    </svg>
  );
}

const s = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
} as const;

export function getUserNavItems(): SidebarNavItem[] {
  return [
    {
      label: "Beranda",
      href: ROUTES.USER.DASHBOARD,
      icon: (
        <Icon>
          <path d="M3 10.7 12 3l9 7.7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.3Z" fill="currentColor" />
        </Icon>
      ),
    },
    {
      label: "Pemeriksaan",
      href: ROUTES.USER.SCAN,
      icon: (
        <Icon>
          <path d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "History",
      href: ROUTES.USER.HISTORY,
      icon: (
        <Icon>
          <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "Konsultasi",
      href: ROUTES.USER.CONSULTATIONS,
      icon: (
        <Icon>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "Premium",
      href: "/user/subscription",
      icon: (
        <Icon>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
        </Icon>
      ),
    },
  ];
}

export function getAdminNavItems(pendingCount: number): SidebarNavItem[] {
  return [
    {
      label: "Dashboard",
      href: ROUTES.ADMIN.DASHBOARD,
      icon: (
        <Icon>
          <path d="M4 11.5 12 5l8 6.5" {...s} />
          <path d="M6.5 10.5V19h11v-8.5" {...s} />
          <path d="M10 19v-5h4v5" {...s} />
        </Icon>
      ),
    },
    {
      label: "Users",
      href: ROUTES.ADMIN.USERS,
      icon: (
        <Icon>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...s} />
          <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...s} />
          <path d="M20 19c0-1.7-1-3.1-2.5-3.7" {...s} />
          <path d="M15.5 5.3a3 3 0 0 1 0 5.4" {...s} />
        </Icon>
      ),
    },
    {
      label: "Doctors",
      href: ROUTES.ADMIN.DOCTORS,
      icon: (
        <Icon>
          <path d="M7 4v5a5 5 0 0 0 10 0V4" {...s} />
          <path d="M7 4H5" {...s} />
          <path d="M17 4h2" {...s} />
          <path d="M12 14v2a4 4 0 0 0 8 0v-1" {...s} />
          <path d="M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "Verification",
      href: ROUTES.ADMIN.DOCTOR_VERIFICATIONS,
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
      icon: (
        <Icon>
          <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" {...s} />
          <path d="m9 12 2 2 4-4" {...s} />
        </Icon>
      ),
    },
  ];
}

export function getDoctorNavItems(): SidebarNavItem[] {
  return [
    {
      label: "Dashboard",
      href: ROUTES.DOCTOR.DASHBOARD,
      icon: (
        <Icon>
          <path d="M4 11.5 12 5l8 6.5" {...s} />
          <path d="M6.5 10.5V19h11v-8.5" {...s} />
          <path d="M10 19v-5h4v5" {...s} />
        </Icon>
      ),
    },
    {
      label: "Konsultasi",
      href: ROUTES.DOCTOR.CONSULTATIONS,
      icon: (
        <Icon>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "Skincare",
      href: ROUTES.DOCTOR.SKINCARE,
      icon: (
        <Icon>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...s} />
          <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...s} />
          <path d="M20 19c0-1.7-1-3.1-2.5-3.7" {...s} />
          <path d="M15.5 5.3a3 3 0 0 1 0 5.4" {...s} />
        </Icon>
      ),
    },
    {
      label: "Rekomendasi",
      href: ROUTES.DOCTOR.RECOMMENDATIONS,
      icon: (
        <Icon>
          <path d="M7 4v5a5 5 0 0 0 10 0V4" {...s} />
          <path d="M7 4H5" {...s} />
          <path d="M17 4h2" {...s} />
          <path d="M12 14v2a4 4 0 0 0 8 0v-1" {...s} />
          <path d="M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...s} />
        </Icon>
      ),
    },
    {
      label: "Skin Concern",
      href: ROUTES.DOCTOR.SKIN_CONCERNS,
      icon: (
        <Icon>
          <path d="M4 7h16" {...s} />
          <path d="M4 12h10" {...s} />
          <path d="M4 17h7" {...s} />
          <path d="M17 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" {...s} />
        </Icon>
      ),
    },
  ];
}
