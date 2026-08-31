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
  phone: string;
  address: string;
  identity: string;
  specialization: string;
  documents: VerificationDocument[];
  status: string;
  rawStatus: VerificationStatus;
  submittedAt: string;
  rejectionReason: string | null;
};
