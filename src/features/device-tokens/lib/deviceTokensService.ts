import type { DeviceToken, DeviceTokenListResponse } from "../types";

export async function getDeviceTokens(
  page = 1,
  perPage = 10
): Promise<DeviceTokenListResponse> {
  try {
    const res = await fetch(`/api/device-tokens?page=${page}&per_page=${perPage}`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    const meta = (data.meta ?? {}) as {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };

    return {
      data: data.data ?? [],
      meta: {
        current_page: meta.current_page ?? page,
        last_page: meta.last_page ?? 1,
        per_page: meta.per_page ?? perPage,
        total: meta.total ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch device tokens:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}

export async function registerDeviceToken(data: {
  token: string;
  platform: string;
  device_name?: string;
}): Promise<DeviceToken | null> {
  try {
    const res = await fetch("/api/device-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const result = await res.json();
    return result.data ?? null;
  } catch (error) {
    console.error("Failed to register device token:", error);
    throw error;
  }
}

export async function deleteDeviceToken(uuid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/device-tokens/${uuid}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete device token:", error);
    throw error;
  }
}
