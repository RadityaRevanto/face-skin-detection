import type { Metadata } from "next";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Dashboard Admin | Face Skin Detection",
  description: "Dashboard administrasi sistem",
};

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-zinc-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
      </div>
    </main>
  );
}