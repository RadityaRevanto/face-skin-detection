import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET() {
  try {
    const res = await fetchApi("/emergency");
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to fetch emergency hotlines:", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
