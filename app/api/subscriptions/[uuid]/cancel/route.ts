import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const resolvedParams = await params;
    const result = await fetchApi(`/subscriptions/${resolvedParams.uuid}/cancel`, {
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
