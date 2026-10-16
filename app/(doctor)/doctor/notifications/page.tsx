import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorNotificationsContent } from "@/features/doctor/notifications/components/DoctorNotificationsContent";
import { TableRowsSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Notifikasi Medis & Klinis | Dokter SkinCek",
  description: "Pusat notifikasi telekonsultasi dan peringatan klinis SkinCek",
};

export default function DoctorNotificationsPage() {
  return (
    <Suspense fallback={<TableRowsSkeleton />}>
      <DoctorNotificationsContent />
    </Suspense>
  );
}
