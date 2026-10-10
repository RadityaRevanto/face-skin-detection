import type { PagePagination } from "@/lib/types/pagination";

export type DoctorVerificationStatus = "pending" | "needs_revision" | "rejected" | "approved";

export type DoctorVerificationPageType = "pending" | "needs_revision" | "rejected";

export type VerificationDocument = {
  uuid: string;
  url: string;
  file_name: string | null;
};

export type DoctorVerificationRequest = {
  id: string;
  no: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  identity: string;
  specialization: string;
  documents: VerificationDocument[];
  status: "pending" | "needs_revision" | "rejected" | "approved";
  submittedAt: string;
  reviewedAt: string;
  rejectionReason: string | null;
};

export type DoctorVerificationStats = {
  pendingCount: number;
  needsRevisionCount: number;
  rejectedCount: number;
  approvedCount: number;
};

export type DoctorVerificationPageData = {
  activeTab: DoctorVerificationPageType;
  verificationRequests: DoctorVerificationRequest[];
  stats: DoctorVerificationStats;
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: DoctorVerificationPageType) => void;
  isLoading?: boolean;
};
