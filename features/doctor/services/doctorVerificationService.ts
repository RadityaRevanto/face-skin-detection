import { api } from "@/lib/api";

import type { DoctorVerification } from "../verification/components/VerificationTypes";

export type { DoctorVerification };

export const doctorVerificationService = {
  show: async (): Promise<DoctorVerification | null> => {
    const response = await api.get("/doctor-verifications");
    return response.data.data ?? null;
  },

  submit: async (formData: FormData) => {
    const response = await api.post("/doctor-verifications", formData);
    return response.data;
  },

  resubmit: async (id: string, formData: FormData) => {
    const response = await api.post(
      `/doctor-verifications/${id}/resubmit`,
      formData,
    );
    return response.data;
  },
};

