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

// POST /api/predict/livecam
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const croppedFile = formData.get("cropped_face") as File | null;

    if (!croppedFile) {
      return NextResponse.json(
        { success: false, error: "Cropped face image tidak ditemukan" },
        { status: 400 }
      );
    }

    // Teruskan ke Laravel, tapi ubah key menjadi 'image' sesuai StoreScanRequest Laravel
    const laravelFormData = new FormData();
    laravelFormData.append("image", croppedFile);

    const response = await fetchApi<PredictionHistoryApi>("scans/livecam", {
      method: "POST",
      body: laravelFormData,
    });

    if (response && response.data) {
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
          recommendations: [],
          scan_mode: "livecam_yolo",
          image_url: history.image_url,
          cropped_image_url: history.cropped_image_url || history.image_url,
          history_id: history.id,
        },
      });
    }

    throw new Error("Invalid response from Laravel");
  } catch (error: any) {
    console.error("Livecam predict error:", error);
    const msg = error?.data?.message || error?.message || "Internal server error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
