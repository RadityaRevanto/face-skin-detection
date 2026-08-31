import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// Proxy rekomendasi dokter → Laravel.
// GET  /api/doctor/recommendations          → GET  /v1/doctor/recommendations
// POST /api/doctor/recommendations          → POST /v1/skin-recommendations
function handleError(error: unknown) {
  const status = error instanceof ApiError ? error.status : 500;
  const message =
    error instanceof ApiError ? error.message : "Terjadi kesalahan server.";
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET() {
  try {
    const response = await fetchApi("doctor/recommendations");
    return NextResponse.json({
      success: true,
      message: "Daftar rekomendasi dimuat.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const laravelBody = {
      concern_id: body.concernId ?? body.concern_id,
      product_id: body.productId ?? body.product_id,
      title: body.title,
      recommendation_text:
        body.recommendationText ?? body.recommendation_text,
      priority_level: body.priorityLevel ?? body.priority_level ?? "medium",
      is_active: body.isActive ?? true,
    };

    const response = await fetchApi("skin-recommendations", {
      method: "POST",
      body: JSON.stringify(laravelBody),
    });

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil dibuat.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}
