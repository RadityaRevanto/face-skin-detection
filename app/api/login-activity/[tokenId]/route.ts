import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    const result = await fetchApi(`/login-activity/${tokenId}`, {
      method: "DELETE",
    });

    return NextResponse.json({ success: true, ...(result as any) });
  } catch (error: any) {
    console.error("Revoke login activity error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mencabut akses perangkat" 
      },
      { status: error.status || 500 }
    );
  }
}
