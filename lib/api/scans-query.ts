// Tipe kanonik yang identik dengan App\Http\Resources\PredictionHistoryResource (BE-SkinCek).
export type ScanMode = "upload" | "livecam";
export type SeverityLevel = "low" | "medium" | "high";

export type SkinConcernInfo = {
  name: string | null;
  description: string | null;
};

export type OtherConcern = {
  ml_label: string;
  name: string | null;
  description: string | null;
  confidence: number;
};

export type PredictionResult = {
  uuid: string;
  scan_mode: ScanMode;
  predicted_class: string;
  confidence: number; // float 0–1
  probabilities: Record<string, number> | null;
  severity_score: number; // integer 0–100
  severity_level: SeverityLevel;
  model_used: string;
  image_url: string | null;
  disclaimer: string;
  skin_concern: SkinConcernInfo | null;
  other_concerns: OtherConcern[];
  notice: string | null;
  created_at: string;
};

export type ScanHistory = PredictionResult;

export async function getScans(page: number = 1) {
  const res = await fetch(`/api/scans?page=${page}&sort=-created_at`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil riwayat scan");
  }

  return res.json();
}
