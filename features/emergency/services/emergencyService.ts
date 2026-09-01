import { api } from "@/lib/api";

import type { EmergencyHotline } from "../types";

export const emergencyService = {
  hotlines: async (): Promise<EmergencyHotline[]> => {
    const response = await api.get("/emergency");
    return response.data.data;
  },
};

