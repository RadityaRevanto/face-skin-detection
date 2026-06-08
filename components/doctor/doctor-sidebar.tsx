"use client";

import { Sidebar, type SidebarNavItem } from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";

function Icon({
  children,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="none"
      className="h-5 w-5"
    >
      {children}
    </svg>
  );
}

const iconStroke = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
} as const;

const doctorNavItems: SidebarNavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DOCTOR.DASHBOARD,
    icon: (
      <Icon>
        <path d="M4 11.5 12 5l8 6.5" {...iconStroke} />
        <path d="M6.5 10.5V19h11v-8.5" {...iconStroke} />
        <path d="M10 19v-5h4v5" {...iconStroke} />
      </Icon>
    ),
  },
  {
    label: "Skincare",
    href: ROUTES.DOCTOR.SKINCARE,
    icon: (
      <Icon>
        <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...iconStroke} />
        <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...iconStroke} />
        <path d="M20 19c0-1.7-1-3.1-2.5-3.7" {...iconStroke} />
        <path d="M15.5 5.3a3 3 0 0 1 0 5.4" {...iconStroke} />
      </Icon>
    ),
  },
  {
    label: "Rekomendasi",
    href: ROUTES.DOCTOR.RECOMMENDATIONS,
    icon: (
      <Icon>
        <path d="M7 4v5a5 5 0 0 0 10 0V4" {...iconStroke} />
        <path d="M7 4H5" {...iconStroke} />
        <path d="M17 4h2" {...iconStroke} />
        <path d="M12 14v2a4 4 0 0 0 8 0v-1" {...iconStroke} />
        <path d="M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...iconStroke} />
      </Icon>
    ),
  },
  {
    label: "Skin Concern",
    href: ROUTES.DOCTOR.SKIN_CONCERNS,
    icon: (
      <Icon>
        <path d="M4 7h16" {...iconStroke} />
        <path d="M4 12h10" {...iconStroke} />
        <path d="M4 17h7" {...iconStroke} />
        <path d="M17 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" {...iconStroke} />
      </Icon>
    ),
  },
];

export function DoctorSidebar() {
  return (
    <Sidebar
      brand={{
        href: ROUTES.DOCTOR.DASHBOARD,
        logo: (
          <div className="flex h-11 w-11 items-center justify-center rounded-full  text-white shadow-lg shadow-emerald-500/25">
            <LeafLogo />
          </div>
        ),
        title: "Skin Detection",
        subtitle: "Doctor Panel",
        mobileTitle: "Doctor Panel",
        mobileSubtitle: "Skin Detection",
      }}
      items={doctorNavItems}
    />
  );
}

function LeafLogo() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 48 48" fill="none">
      <path
        d="M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z"
        fill="#10B981"
      />
      <path
        d="M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z"
        fill="#047857"
      />
      <path
        d="M12 31.5c6.6-8.1 13.5-14.4 24-20.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}