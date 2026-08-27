import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let channel_name: string | undefined;
    let socket_id: string | undefined;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      channel_name = params.get("channel_name") ?? undefined;
      socket_id = params.get("socket_id") ?? undefined;
    } else {
      const body = await req.json();
      channel_name = body.channel_name;
      socket_id = body.socket_id;
    }

    console.log("[broadcasting/auth] received:", { channel_name, socket_id });

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      console.log("[broadcasting/auth] no token in cookie");
      return NextResponse.json(
        { message: "No auth token" },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    // baseUrl usually already has /api/v1
    const url = `${baseUrl.replace(/\/$/, "")}/broadcasting/auth`;

    console.log("[broadcasting/auth] forwarding to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel_name, socket_id }),
    });

    const responseText = await response.text();
    console.log("[broadcasting/auth] backend response:", response.status, responseText.slice(0, 300));

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[broadcasting/auth] CATCH:", error?.name, error?.message, error?.cause);
    return NextResponse.json(
      { message: error?.message || "Broadcasting auth failed" },
      { status: 500 }
    );
  }
}
