import { fetchEnvelope } from "@/lib/api/handlers";

import type { EmergencyHotline } from "../types";

export const emergencyService = {
  /** GET /emergency — {data: hotlines[]} tanpa meta. */
  hotlines: (): Promise<EmergencyHotline[]> =>
    fetchEnvelope<EmergencyHotline[]>("/emergency").then((r) => r.data),
};
