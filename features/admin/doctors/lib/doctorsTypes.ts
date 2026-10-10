import type { PagePagination } from "@/lib/types/pagination";

export type DoctorRow = {
  id: string; // uuid
  name: string;
  email: string;
  avatarUrl: string | null;
  specialization: string;
  strNumber: string;
  verificationStatus: "approved" | "pending" | "needs_revision" | "rejected";
  isActive: boolean;
  createdAt: string;
};

export type DoctorsPageData = {
  doctors: DoctorRow[];
  totalDoctors: number;
  pendingSipCount: number;
  pagination: PagePagination;
};
