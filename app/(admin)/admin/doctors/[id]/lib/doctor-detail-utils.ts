import type { DoctorVerificationStatus } from "./doctor-detail-types";

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function getDocumentLabel(documentUrl: string | null) {
  if (!documentUrl) {
    return "No Document";
  }

  const fileName = documentUrl.split("/").pop();

  return fileName || "Document";
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

export function getInitials(name: string) {
  return name
    .replace(/^dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
