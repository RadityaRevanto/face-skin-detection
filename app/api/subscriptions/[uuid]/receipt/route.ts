import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// GET /api/subscriptions/[uuid]/receipt — detail struk langganan aktif.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  try {
    const response = await fetchApi(`subscriptions/${uuid}/receipt`);
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Gagal mengambil struk langganan.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
