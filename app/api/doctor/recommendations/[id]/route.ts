import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// PATCH  /api/doctor/recommendations/[id] → PATCH  /v1/skin-recommendations/{uuid}
// DELETE /api/doctor/recommendations/[id] → DELETE /v1/skin-recommendations/{uuid}
type RouteContext = {
  params: Promise<{ id: string }>;
};

function handleError(error: unknown) {
  const status = error instanceof ApiError ? error.status : 500;
  const message =
    error instanceof ApiError ? error.message : "Terjadi kesalahan server.";
  return NextResponse.json({ success: false, message }, { status });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const laravelBody: Record<string, unknown> = {
      concern_id: body.concernId ?? body.concern_id,
      product_id: body.productId ?? body.product_id,
      title: body.title,
      recommendation_text: body.recommendationText ?? body.recommendation_text,
      priority_level: body.priorityLevel ?? body.priority_level,
    };
    if (typeof body.isActive === "boolean") {
      laravelBody.is_active = body.isActive;
    }

    const response = await fetchApi(`skin-recommendations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(laravelBody),
    });

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil diperbarui.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    await fetchApi(`skin-recommendations/${id}`, { method: "DELETE" });

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil dihapus.",
    });
  } catch (error) {
    return handleError(error);
  }
}
