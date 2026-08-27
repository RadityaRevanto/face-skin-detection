import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await fetchApi(`/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Change role error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengubah role pengguna" 
      },
      { status: error.status || 500 }
    );
  }
}
