import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const result = await fetchApi("/email/verify/send", {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengirim kode OTP",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
