import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = `/doctors/${resolvedParams.uuid}/ratings${queryString ? `?${queryString}` : ""}`;
    
    const result = await fetchApi(endpoint);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat ulasan dokter" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    const result = await fetchApi(`/doctors/${resolvedParams.uuid}/ratings`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menyimpan ulasan",
        errors: error.errors,
      },
      { status: error.status || 500 }
    );
  }
}
