import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

// POST /api/predict/upload
// Proxy ke Laravel POST /scans. Respons = PredictionHistoryResource apa adanya.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    // Teruskan FormData langsung ke Laravel (key harus 'image' sesuai StoreScanRequest)
    const response = await fetchApi<PredictionResult>("scans", {
      method: "POST",
      body: formData,
    });

    // Debug: pastikan backend mengembalikan rekomendasi
    const data = response.data as any;
    console.log("[upload] response keys:", Object.keys(data));
    console.log("[upload] treatment_recommendations:", JSON.stringify(data.treatment_recommendations ?? "MISSING"));
    console.log("[upload] skincare_recommendations:", JSON.stringify(data.skincare_recommendations ?? "MISSING"));

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload predict error:", error);
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Terjadi kesalahan internal saat analisis gambar.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
