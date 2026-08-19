import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await fetchApi("/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal menyimpan profil" 
      },
      { status: error.status || 500 }
    );
  }
}
