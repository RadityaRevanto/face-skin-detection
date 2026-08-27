import { NextRequest } from "next/server";
import { getAuthToken } from "@/lib/auth/token";
import { API_BASE_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const url = `${API_BASE_URL}/profile/exports/download?${queryString}`;

    const headers: Record<string, string> = {
      Accept: "application/octet-stream",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    const fileName =
      response.headers.get("content-disposition")
        ?.match(/filename="?(.+?)"?$/)?.[1]
      ?? "skincek-data.json";

    const blob = await response.blob();

    return new Response(blob, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Export download error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Gagal mengunduh data" }),
      { status: error.status || 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
