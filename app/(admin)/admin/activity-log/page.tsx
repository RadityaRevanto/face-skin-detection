import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivityLogClientPage } from "@/features/admin/activity-log/components/ActivityLogClientPage";
import { TableRowsSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Activity Log | Admin SkinCek",
  description: "Jejak audit dan log aktivitas sistem SkinCek",
};

export default function AdminActivityLogPage() {
  return (
    <Suspense fallback={<TableRowsSkeleton />}>
      <ActivityLogClientPage />
    </Suspense>
  );
}

