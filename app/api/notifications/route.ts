import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "10";

    const result = await fetchApi(`/notifications?page=${page}&per_page=${perPage}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil notifikasi" },
      { status: error.status || 500 }
    );
  }
}
