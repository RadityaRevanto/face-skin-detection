import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const { id } = await params;

    const result = await fetchApi(`/conversations/${id}/messages?page=${page}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fetch messages error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil pesan" 
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Determine if it's FormData (for media) or JSON (for text-only)
    const contentType = request.headers.get("content-type") || "";
    let body: BodyInit;
    let headers: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
      // fetchApi will automatically handle the headers when body is FormData
      // DO NOT set Content-Type header manually for FormData, fetch will set it with boundary
    } else {
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
      headers["Content-Type"] = "application/json";
    }

    const { id } = await params;

    const result = await fetchApi(`/conversations/${id}/messages`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Send message error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengirim pesan" 
      },
      { status: error.status || 500 }
    );
  }
}
