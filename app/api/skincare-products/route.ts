import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "12";
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const params = new URLSearchParams({ page, per_page });
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  try {
    const res = await fetchApi(`/skincare-products?${params.toString()}`);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to fetch skincare products:", error);
    return NextResponse.json(
      { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } },
      { status: 500 }
    );
  }
}
