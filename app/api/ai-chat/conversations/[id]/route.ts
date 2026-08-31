import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// DELETE /api/ai-chat/conversations/[id] — hapus riwayat chat Aura Skin.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetchApi(`ai-chat/conversations/${id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ success: true, data: response.data ?? null });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Gagal menghapus riwayat chat Aura Skin.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
