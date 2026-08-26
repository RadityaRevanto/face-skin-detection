import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    const result = await fetchApi(`/conversations?page=${page}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fetch conversations error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil data obrolan" 
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await fetchApi("/conversations", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Create conversation error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal membuat ruang obrolan" 
      },
      { status: error.status || 500 }
    );
  }
}
