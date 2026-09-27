export type VerificationStatus = "pending" | "approved" | "rejected";

export type VerificationDocument = {
  uuid: string;
  url: string;
  file_name: string | null;
};

export type DoctorVerificationDetail = {
  id: string;
  doctorId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  title: string | null;
  identity: string;
  specialization: string;
  subSpecialization: string | null;
  experienceYears: number | null;
  almaMater: string | null;
  practiceLocations: string[];
  professionalOrganizations: string[];
  documents: VerificationDocument[];
  status: string;
  rawStatus: VerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  revisionNote: string | null;
};