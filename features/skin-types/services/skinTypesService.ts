import { api } from "@/lib/api";

import type { SkinType, SkinTypeListResponse } from "../types";

export async function getSkinTypes(
  page = 1,
  perPage = 10
): Promise<SkinTypeListResponse> {
  try {
    const response = await api.get<SkinTypeListResponse>("/skin-types", {
      params: { page, per_page: perPage },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch skin types:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}

export async function createSkinType(data: {
  name: string;
  description?: string;
}): Promise<SkinType | null> {
  const response = await api.post("/skin-types", data);
  return response.data?.data ?? null;
}

export async function updateSkinType(
  uuid: string,
  data: { name?: string; description?: string }
): Promise<SkinType | null> {
  const response = await api.patch(`/skin-types/${uuid}`, data);
  return response.data?.data ?? null;
}

export async function deleteSkinType(uuid: string): Promise<boolean> {
  await api.delete(`/skin-types/${uuid}`);
  return true;
}
