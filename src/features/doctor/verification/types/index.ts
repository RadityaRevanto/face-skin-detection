import type { ReactNode } from "react";

export type IconProps = {
  children: ReactNode;
  className?: string;
};

export type DoctorProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
};

export type VerificationDocument = {
  uuid: string;
  url: string;
  file_name?: string | null;
};

export type DoctorVerification = {
  uuid: string;
  str_number: string | null;
  specialization: string | null;
  title?: string | null;
  sub_specialization?: string | null;
  experience_years?: number | null;
  alma_mater?: string | null;
  documents: VerificationDocument[];
  verification_status: string | null;
  rejection_reason: string | null;
  revision_note: string | null;
  reviewed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StepStatus = "completed" | "current" | "pending" | "failed";

export type ApiStatusError = Error & { status?: number };

export type VerificationStep = {
  title: string;
  description: string;
  status: StepStatus;
};
