import type { Metadata } from "next";
import { ActivityLogContainer } from "@/src/features/activity-log/components/ActivityLogContainer";

export const metadata: Metadata = {
  title: "Activity Log",
  description: "Log aktivitas sistem",
};

export default function AdminActivityLogPage() {
  return (
    <main className="w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
      <ActivityLogContainer />
    </main>
  );
}
