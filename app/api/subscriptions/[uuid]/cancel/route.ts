import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const result = await fetchApi(`/subscriptions/${params.uuid}/cancel`, {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal membatalkan langganan",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
