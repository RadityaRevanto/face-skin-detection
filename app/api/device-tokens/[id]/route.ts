import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    await fetchApi(`/device-tokens/${id}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete device token:", error);
    return NextResponse.json(
      { message: "Gagal menghapus device token" },
      { status: 500 }
    );
  }
}
