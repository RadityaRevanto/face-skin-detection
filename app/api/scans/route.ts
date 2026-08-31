import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    const result = await fetchApi(`/scans?page=${page}&sort=-created_at`, {
      method: "GET",
    });

    // Debug: cek apakah list scans mengembalikan rekomendasi
    const items = result.data as any[];
    if (items?.length) {
      const first = items[0];
      console.log("[scans list] first item keys:", Object.keys(first));
      console.log("[scans list] treatment_recommendations:", JSON.stringify(first.treatment_recommendations ?? "MISSING"));
      console.log("[scans list] skincare_recommendations:", JSON.stringify(first.skincare_recommendations ?? "MISSING"));
    }

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
