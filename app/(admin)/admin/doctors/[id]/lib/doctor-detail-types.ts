export type DoctorVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision_required"
  | "suspended";

export type DoctorDetail = {
  id: string;
  name: string;
  email: string;
  role: "doctor";
  isActive: boolean;
  joinedAt: string;
  avatarUrl: string | null;
  latestVerification: {
    id: string;
    identity: string;
    specialization: string;
    document: string;
    documentUrl: string | null;
    status: string;
    rawStatus: DoctorVerificationStatus;
    submittedAt: string;
    reviewedAt: string;
    rejectionReason: string | null;
  } | null;
};
