import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await fetchApi(`/notifications/${id}/read`, {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notifications mark read error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menandai notifikasi" },
      { status: error.status || 500 }
    );
  }
}
