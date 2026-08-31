import type { EmergencyHotline } from "../types";

export async function getEmergencyHotlines(): Promise<EmergencyHotline[]> {
  try {
    const res = await fetch("/api/emergency", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch emergency hotlines:", error);
    return [];
  }
}
