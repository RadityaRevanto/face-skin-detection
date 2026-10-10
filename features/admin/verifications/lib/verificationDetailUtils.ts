import type { VerificationStatus } from "./verificationDetailTypes";

export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function formatDateOnly(date: string | null | undefined): string {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function mapVerificationStatus(
  status: VerificationStatus | string,
): string {
  switch (status) {
    case "pending":
      return "Menunggu Review";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "needs_revision":
    case "revision_required":
      return "Perlu Revisi";
    default:
      return "Menunggu Review";
  }
}
