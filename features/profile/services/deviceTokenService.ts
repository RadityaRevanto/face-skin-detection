import { fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";

export type DeviceToken = {
  uuid: string;
  fcm_token?: string;
  platform?: string;
  created_at?: string;
  last_used_at?: string | null;
  [key: string]: unknown;
};

export type RegisterDeviceTokenPayload = {
  fcm_token: string;
  platform: string;
};

export const deviceTokenService = {
  /** GET /device-tokens — paginated. */
  list: (page = 1, perPage?: number) =>
    fetchPaginated<DeviceToken>("/device-tokens", paginationParams(page, perPage)),

  /** POST /device-tokens — registrasi token FCM. */
  register: (payload: RegisterDeviceTokenPayload): Promise<DeviceToken> =>
    mutate<DeviceToken>("post", "/device-tokens", payload).then((r) => r.data),

  /** DELETE /device-tokens/{uuid} — hapus token perangkat. */
  destroy: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/device-tokens/${uuid}`),
};
