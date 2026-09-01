import { api } from "@/lib/api";

export type DeviceToken = {
  uuid: string;
  fcm_token?: string;
  platform?: string;
  created_at?: string;
  last_used_at?: string | null;
  [key: string]: unknown;
};

export const deviceTokenService = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/device-tokens", { params });
    return response.data as {
      data: DeviceToken[];
      meta: { current_page: number; last_page: number; per_page: number; total: number };
    };
  },

  register: async (payload: { fcm_token: string; platform: string }) => {
    const response = await api.post("/device-tokens", payload);
    return response.data.data as DeviceToken;
  },

  destroy: async (uuid: string) => {
    const response = await api.delete(`/device-tokens/${uuid}`);
    return response.data;
  },
};
