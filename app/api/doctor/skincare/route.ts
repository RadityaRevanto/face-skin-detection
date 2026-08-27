import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// Proxy produk skincare dokter → Laravel.
// GET  /api/doctor/skincare          → GET  /v1/doctor/products
// POST /api/doctor/skincare          → POST /v1/skincare-products
function handleError(error: unknown) {
  const status = error instanceof ApiError ? error.status : 500;
  const message =
    error instanceof ApiError ? error.message : "Terjadi kesalahan server.";
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET() {
  try {
    const response = await fetchApi("doctor/products");
    return NextResponse.json({
      success: true,
      message: "Daftar produk dimuat.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

type SkincareBody = Record<string, unknown>;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SkincareBody;

    // Terjemahkan key camelCase form ke snake_case API Laravel.
    const laravelBody = {
      concern_id: body.concernId ?? body.concern_id,
      skin_type_id: body.skinTypeId ?? body.skin_type_id,
      name: body.name,
      category: body.category,
      gender: body.genderSuitability ?? body.gender ?? "unisex",
      key_ingredients: body.keyIngredients ?? body.key_ingredients,
      usage_instruction: body.usageInstruction ?? body.usage_instruction,
      warning: body.warning ?? null,
      is_active: body.isActive ?? true,
    };

    const response = await fetchApi("skincare-products", {
      method: "POST",
      body: JSON.stringify(laravelBody),
    });

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil dibuat.",
      data: response.data,
    });
  } catch (error) {
    return handleError(error);
  }
}
