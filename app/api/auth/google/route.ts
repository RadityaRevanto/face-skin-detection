import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await fetchApi("/auth/google", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal masuk menggunakan akun Google",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
