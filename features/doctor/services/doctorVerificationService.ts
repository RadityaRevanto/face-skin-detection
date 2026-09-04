import { fetchEnvelope, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";

import type { DoctorVerification } from "../verification/components/VerificationTypes";

export type { DoctorVerification };

export const doctorVerificationService = {
  /**
   * GET /doctor-verifications — status verifikasi sendiri.
   * 404 "Belum ada pengajuan verifikasi" jika belum pernah mengajukan.
   */
  show: (): Promise<DoctorVerification | null> =>
    fetchEnvelope<DoctorVerification | null>("/doctor-verifications").then(
      (r) => r.data ?? null,
    ),

  /** POST /doctor-verifications — multipart: data profesional + documents[]. */
  submit: (formData: FormData): Promise<ApiEnvelope<DoctorVerification>> =>
    mutate("post", "/doctor-verifications", formData),

  /** POST /doctor-verifications/{uuid}/resubmit — ajukan ulang (revisi/ditolak). */
  resubmit: (uuid: string, formData: FormData): Promise<ApiEnvelope<DoctorVerification>> =>
    mutate("post", `/doctor-verifications/${uuid}/resubmit`, formData),
};
