import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await fetchApi(`/notifications/${id}`, {
      method: "DELETE",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notifications delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menghapus notifikasi" },
      { status: error.status || 500 }
    );
  }
}
