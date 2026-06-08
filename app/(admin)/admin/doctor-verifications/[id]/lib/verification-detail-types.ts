export type VerificationStatus = "pending" | "approved" | "rejected";

export type DoctorVerificationDetail = {
  id: string;
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  identity: string;
  specialization: string;
  document: string;
  documentUrl: string | null;
  status: string;
  rawStatus: VerificationStatus;
  submittedAt: string;
  rejectionReason: string | null;
};
