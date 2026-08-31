import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

// POST /api/predict/livecam
// Proxy ke Laravel POST /scans/livecam. Respons = PredictionHistoryResource apa adanya.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const croppedFile = formData.get("cropped_face");

    if (!(croppedFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Cropped face image tidak ditemukan" },
        { status: 400 }
      );
    }

    // Teruskan ke Laravel dengan key 'image' sesuai StoreScanRequest
    const laravelFormData = new FormData();
    laravelFormData.append("image", croppedFile, croppedFile.name || "livecam_frame.jpg");

    const response = await fetchApi<PredictionResult>("scans/livecam", {
      method: "POST",
      body: laravelFormData,
    });

    // Debug: pastikan backend mengembalikan rekomendasi
    const data = response.data as any;
    console.log("[livecam] response keys:", Object.keys(data));
    console.log("[livecam] treatment_recommendations:", JSON.stringify(data.treatment_recommendations ?? "MISSING"));
    console.log("[livecam] skincare_recommendations:", JSON.stringify(data.skincare_recommendations ?? "MISSING"));

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Livecam predict error:", error);
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Terjadi kesalahan internal saat analisis livecam.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
