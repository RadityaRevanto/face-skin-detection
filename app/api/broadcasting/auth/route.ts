import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: BodyInit;
    let headers: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = new URLSearchParams(formData as any).toString();
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
      headers["Content-Type"] = "application/json";
    }

    const result = await fetchApi("/broadcasting/auth", {
      method: "POST",
      headers,
      body,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Broadcasting auth error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal autentikasi channel" },
      { status: error.status || 403 }
    );
  }
}
