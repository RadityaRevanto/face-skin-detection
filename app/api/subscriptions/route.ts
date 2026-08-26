import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET() {
  try {
    const result = await fetchApi("/subscriptions", {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal memuat langganan",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
