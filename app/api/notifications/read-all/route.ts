import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const result = await fetchApi("/notifications/read-all", {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notifications read-all error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menandai notifikasi" },
      { status: error.status || 500 }
    );
  }
}
