import type { PagePagination } from "@/lib/types/pagination";

export type DoctorVerificationStatus = "approved";

export type DoctorDocument = {
  uuid: string;
  url: string;
  file_name: string | null;
};

export type DoctorRow = {
  id: string;
  verificationId: string;
  no: number;
  name: string;
  email: string;
  identity: string;
  specialization: string;
  documents: DoctorDocument[];
  verifiedAt: string;
  status: "Approved";
  rawStatus: DoctorVerificationStatus;
  isActive: boolean;
};

export type DoctorsPageData = {
  doctors: DoctorRow[];
  pagination: PagePagination;
};
