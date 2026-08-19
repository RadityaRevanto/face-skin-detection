import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    // Usually API_URL ends with /api/v1, so we replace it to target the broadcasting route.
    // In Laravel 11, broadcasting auth is typically registered at /broadcasting/auth or /api/broadcasting/auth.
    // By default, `Broadcast::routes(['middleware' => ['auth:sanctum']]);` registers at `/broadcasting/auth`
    // If the proxy fails, it might be due to route prefix, but `/broadcasting/auth` is standard.
    const baseUrl = apiUrl.replace("/api/v1", "");
    const authUrl = `${baseUrl}/broadcasting/auth`;

    const res = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      body: body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Broadcast auth failed:", res.status, errorText);
      return NextResponse.json({ message: "Broadcast auth failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Broadcast auth error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
