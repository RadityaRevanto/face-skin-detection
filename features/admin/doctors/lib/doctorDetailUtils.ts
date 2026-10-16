import type { DoctorVerificationStatus } from "./doctorDetailTypes";

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function mapVerificationStatus(
  status: DoctorVerificationStatus | string,
) {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "revision_required") return "Revision Required";
  if (status === "suspended") return "Suspended";

  return "Not Submitted";
}

