import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function DELETE(request: NextRequest) {
  try {
    const result = await fetchApi("/profile/avatar", {
      method: "DELETE",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Avatar delete error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal menghapus foto profil" 
      },
      { status: error.status || 500 }
    );
  }
}
