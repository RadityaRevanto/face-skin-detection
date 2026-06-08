"use client";

import { usePathname } from "next/navigation";

import { DashboardHeader } from "@/components/admin/admin-header";

function getHeaderContent(pathname: string) {
  if (pathname.startsWith("/admin/dashboard")) {
    return {
      title: "Dashboard",
      description: "Welcome back, Admin! Here's what's happening today.",
    };
  }

  if (pathname.startsWith("/admin/doctors")) {
    return {
      title: "Doctors",
      description: "Manage verified doctors",
    };
  }

  if (pathname.startsWith("/admin/doctor-verifications/rejected")) {
    return {
      title: "Verification",
      description: "Rejected doctor verification history",
    };
  }

  if (pathname.startsWith("/admin/doctor-verifications")) {
    return {
      title: "Verification",
      description: "Review doctor verification requests",
    };
  }

  if (pathname.startsWith("/admin/users")) {
    return {
      title: "Users",
      description: "Manage registered users",
    };
  }

  return {
    title: "Admin",
    description: "Manage Face Skin Detection system",
  };
}

export function AdminLayoutHeader() {
  const pathname = usePathname();
  const header = getHeaderContent(pathname);

  return (
    <DashboardHeader title={header.title} description={header.description} />
  );
}
