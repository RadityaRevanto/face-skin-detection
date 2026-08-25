import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST() {
  try {
    const result = await fetchApi("/subscriptions/checkout", {
      method: "POST",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal membuat transaksi",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
