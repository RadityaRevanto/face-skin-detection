import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminNotificationsContent } from "@/features/admin/notifications/components/AdminNotificationsContent";
import { TableRowsSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Notifikasi Sistem | Admin SkinCek",
  description: "Pusat notifikasi dan peringatan sistem SkinCek",
};

export default function AdminNotificationsPage() {
  return (
    <Suspense fallback={<TableRowsSkeleton />}>
      <AdminNotificationsContent />
    </Suspense>
  );
}
