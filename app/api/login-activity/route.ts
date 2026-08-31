import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET() {
  try {
    const result = await fetchApi("/login-activity");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data sesi" },
      { status: error.status || 500 }
    );
  }
}
