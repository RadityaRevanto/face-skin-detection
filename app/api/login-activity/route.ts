import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const result = await fetchApi("/login-activity", {
      method: "GET",
    });

    return NextResponse.json({ success: true, ...(result as any) });
  } catch (error: any) {
    console.error("Fetch login activity error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil daftar aktivitas login" 
      },
      { status: error.status || 500 }
    );
  }
}
