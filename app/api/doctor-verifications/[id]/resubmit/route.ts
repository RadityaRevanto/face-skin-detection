import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const result = await fetchApi(`/doctor-verifications/${id}/resubmit`, {
      method: "POST",
      body: formData,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Resubmit verification error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengunggah dokumen revisi" 
      },
      { status: error.status || 500 }
    );
  }
}
