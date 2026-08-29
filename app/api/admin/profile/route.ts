import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const result = await fetchApi("/admin/profile", {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Admin profile fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil profil admin" },
      { status: error.status || 500 }
    );
  }
}
