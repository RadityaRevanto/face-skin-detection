import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    const result = await fetchApi(`/scans?page=${page}&sort=-created_at`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fetch scans error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil riwayat scan" 
      },
      { status: error.status || 500 }
    );
  }
}
