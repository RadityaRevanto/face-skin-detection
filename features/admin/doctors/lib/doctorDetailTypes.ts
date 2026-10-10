export type DoctorVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision"
  | "revision_required"
  | "suspended";

export type DoctorDocument = {
  uuid: string;
  url: string;
  file_name: string | null;
};

export type DoctorDetail = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "doctor";
  isActive: boolean;
  joinedAt: string;
  avatarUrl: string | null;
  sipNumber?: string;
  latestVerification: {
    id: string;
    identity: string;
    specialization: string;
    subSpecialization?: string;
    documents: DoctorDocument[];
    status: string;
    rawStatus: DoctorVerificationStatus;
    submittedAt: string;
    reviewedAt?: string | null;
    rejectionReason?: string | null;
    strExpiry?: string;
    strIssuer?: string;
    clinicalExperience?: string;
    almamater?: string;
    practiceLocations?: Array<{
      name: string;
      city: string;
      tag: string;
    }>;
    organizations?: string[];
  } | null;
};
