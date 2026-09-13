import type { Metadata } from "next";
import { ActivityLogContainer } from "@/features/activity-log/components/ActivityLogContainer";

export const metadata: Metadata = {
  title: "Activity Log",
  description: "Log aktivitas sistem",
};

export default function AdminActivityLogPage() {
  return (
    <main className="w-full">
      <ActivityLogContainer />
    </main>
  );
}
