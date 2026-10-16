export type UserDetail = {
  id: string;
  name: string;
  email: string;
  role: "user" | "doctor" | "admin";
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  gender?: string | null;
  age?: number | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  emailVerifiedAt?: string | null;
  doctorVerification?: {
    specialization?: string;
    str_number?: string | null;
    verification_status?: string;
  } | null;
};
