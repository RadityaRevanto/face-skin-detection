export type DoctorRow = {
  id: string;
  verificationId: string;
  no: number;
  name: string;
  email: string;
  identity: string;
  specialization: string;
  document: string;
  documentUrl: string | null;
  verifiedAt: string;
  status: string;
  isActive: boolean;
};

export type DoctorsPageData = {
  doctors: DoctorRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
