export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision_required"
  | "suspended";

export type DoctorVerificationRequest = {
  id: string;
  no: number;
  name: string;
  email: string;
  identity: string;
  specialization: string;
  document: string;
  documentUrl: string | null;
  status: string;
  submittedAt: string;
};

export type DoctorVerificationStats = {
  pendingCount: number;
  revisionCount: number;
  totalQueue: number;
};

export type DoctorVerificationPageData = {
  verificationRequests: DoctorVerificationRequest[];
  stats: DoctorVerificationStats;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
