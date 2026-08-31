import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "20";

  try {
    const res = await fetchApi(`/admin/activity-log?page=${page}&per_page=${per_page}`);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to fetch activity log:", error);
    return NextResponse.json(
      { data: [], meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 } },
      { status: 500 }
    );
  }
}
