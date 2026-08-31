import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await fetchApi(`/login-activity/${id}`, { method: "DELETE" });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mencabut sesi" },
      { status: error.status || 500 }
    );
  }
}
