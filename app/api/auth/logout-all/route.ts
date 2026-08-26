import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const result = await fetchApi("/logout-all", {
      method: "POST",
    });

    return NextResponse.json({ success: true, ...(result as any) });
  } catch (error: any) {
    console.error("Logout all devices error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mencabut akses semua perangkat" 
      },
      { status: error.status || 500 }
    );
  }
}
