import type { SkinType, SkinTypeListResponse } from "../types";

export async function getSkinTypes(
  page = 1,
  perPage = 10
): Promise<SkinTypeListResponse> {
  try {
    const res = await fetch(`/api/skin-types?page=${page}&per_page=${perPage}`);

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
  try {
    const res = await fetch("/api/skin-types", {
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
    console.error("Failed to create skin type:", error);
    throw error;
  }
}

export async function updateSkinType(
  uuid: string,
  data: { name?: string; description?: string }
): Promise<SkinType | null> {
  try {
    const res = await fetch(`/api/skin-types/${uuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const result = await res.json();
    return result.data ?? null;
  } catch (error) {
    console.error("Failed to update skin type:", error);
    throw error;
  }
}

export async function deleteSkinType(uuid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/skin-types/${uuid}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete skin type:", error);
    throw error;
  }
}
