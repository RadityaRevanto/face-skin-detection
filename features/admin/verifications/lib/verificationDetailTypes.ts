export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_revision";

export type VerificationDocument = {
  uuid: string;
  url: string;
  file_name: string | null;
  file_size?: string | null;
  badge?: string | null;
  uploaded_at?: string | null;
};

export type PracticeLocationItem = {
  name: string;
  dept?: string;
  schedule?: string;
};

export type DoctorVerificationDetail = {
  id: string;
  doctorId: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl: string | null;
  title: string | null;
  identity: string;
  specialization: string;
  subSpecialization: string | null;
  experienceYears: number | null;
  almaMater: string | null;
  strExpiry?: string | null;
  practiceLocations: PracticeLocationItem[];
  professionalOrganizations: string[];
  documents: VerificationDocument[];
  status: string;
  rawStatus: VerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  revisionNote: string | null;
};
