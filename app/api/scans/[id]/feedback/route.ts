import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await fetchApi(`/scans/${id}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan feedback error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengirim ulasan" },
      { status: error.status || 500 }
    );
  }
}
