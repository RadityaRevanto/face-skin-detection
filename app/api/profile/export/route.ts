import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const result = await fetchApi("/profile/export", {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile export error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengeskpor data",
      },
      { status: error.status || 500 }
    );
  }
}
