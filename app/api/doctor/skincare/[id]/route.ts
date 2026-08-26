import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// PATCH  /api/doctor/skincare/[id] → PATCH  /v1/skincare-products/{uuid}
// DELETE /api/doctor/skincare/[id] → DELETE /v1/skincare-products/{uuid}
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

    const laravelBody = {
      concern_id: body.concernId ?? body.concern_id,
      skin_type_id: body.skinTypeId ?? body.skin_type_id,
      name: body.name,
      category: body.category,
      gender: body.genderSuitability ?? body.gender,
      key_ingredients: body.keyIngredients ?? body.key_ingredients,
      usage_instruction: body.usageInstruction ?? body.usage_instruction,
      warning: body.warning ?? null,
      is_active: body.isActive,
    };

    const response = await fetchApi(`skincare-products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(laravelBody),
    });

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil diperbarui.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    await fetchApi(`skincare-products/${id}`, { method: "DELETE" });

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil dihapus.",
    });
  } catch (error) {
    return handleError(error);
  }
}
