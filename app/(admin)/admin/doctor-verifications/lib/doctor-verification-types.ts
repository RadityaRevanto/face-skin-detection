export type VerificationStatus = "pending" | "approved" | "rejected";

export type DoctorVerificationPageType = "pending" | "rejected";

export type DoctorVerificationRequest = {
  id: string;
  no: number;
  name: string;
  email: string;
  identity: string;
  specialization: string;
  document: string;
  documentUrl: string | null;
  status: "Pending" | "Rejected";
  submittedAt: string;
  reviewedAt: string;
  rejectionReason: string | null;
};

export type DoctorVerificationStats = {
  pendingCount: number;
  rejectedCount: number;
  approvedCount: number;
};

export type DoctorVerificationPageData = {
  pageType: DoctorVerificationPageType;
  verificationRequests: DoctorVerificationRequest[];
  stats: DoctorVerificationStats;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
