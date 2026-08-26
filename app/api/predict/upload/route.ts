import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

interface PredictionHistoryApi {
  id: string;
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  severity_score: number;
  severity_level: string;
  model_used: string;
  image_url: string;
  cropped_image_url?: string;
}

// POST /api/predict/upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Teruskan FormData langsung ke Laravel
    // fetchApi akan otomatis mengambil token dari HttpOnly cookies jika user login
    const response = await fetchApi<PredictionHistoryApi>("scans", {
      method: "POST",
      body: formData,
    });

    if (response && response.data) {
      // Laravel mengembalikan hasil dari ScanController (PredictionHistoryResource)
      // Kita kembalikan format yang diharapkan oleh frontend
      const history = response.data;
      return NextResponse.json({
        success: true,
        data: {
          prediction: {
            predicted_class: history.predicted_class,
            confidence: history.confidence,
            probabilities: history.probabilities,
            severity_score: history.severity_score,
            severity_level: history.severity_level,
            model_used: history.model_used,
          },
          // Karena recommendations mungkin tidak dikembalikan dari /scans,
          // kita set kosong atau abaikan, nanti di frontend akan difetch oleh halaman lain.
          // Atau jika diperlukan, fetch recommendations di sini
          recommendations: [],
          scan_mode: "upload_image",
          image_url: history.image_url,
          cropped_image_url: history.cropped_image_url,
          history_id: history.id,
        },
      });
    }

    throw new Error("Invalid response from Laravel");
  } catch (error: any) {
    console.error("Upload predict error:", error);
    const msg = error?.data?.message || error?.message || "Internal server error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
