import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET() {
  try {
    const result = await fetchApi("/notifications/unread-count", {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notifications unread-count error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil jumlah notifikasi" },
      { status: error.status || 500 },
    );
  }
}
