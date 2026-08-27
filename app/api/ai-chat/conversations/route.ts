import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// POST /api/ai-chat/conversations — mulai/ambil percakapan dengan bot Aura Skin.
export async function POST() {
  try {
    const response = await fetchApi("ai-chat/conversations", {
      method: "POST",
    });

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Gagal memulai percakapan dengan Aura Skin.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
