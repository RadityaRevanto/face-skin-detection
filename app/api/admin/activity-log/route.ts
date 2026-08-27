import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "10";
    
    // Construct query parameters
    const query = new URLSearchParams({
      page,
      per_page: perPage,
    });
    
    // Pass along any other filter parameters
    for (const [key, value] of searchParams.entries()) {
      if (key !== "page" && key !== "per_page") {
        query.append(key, value);
      }
    }

    const result = await fetchApi(`/admin/activity-log?${query.toString()}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Activity log fetch error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil log aktivitas" 
      },
      { status: error.status || 500 }
    );
  }
}
