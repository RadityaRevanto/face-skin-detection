import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "10";

  try {
    const res = await fetchApi(`/device-tokens?page=${page}&per_page=${per_page}`);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("Failed to fetch device tokens:", error);
    return NextResponse.json(
      { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetchApi("/device-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("Failed to register device token:", error);
    return NextResponse.json(
      { message: error.message || "Gagal mendaftarkan device token" },
      { status: error.status || 500 }
    );
  }
}
