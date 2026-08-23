import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const result = await fetchApi("/ai-chat/consent", {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI consent fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil status persetujuan AI" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await fetchApi("/ai-chat/consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI consent update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui persetujuan AI" },
      { status: error.status || 500 }
    );
  }
}
