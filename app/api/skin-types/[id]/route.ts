import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const res = await fetchApi(`/skin-types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to update skin type:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate skin type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    await fetchApi(`/skin-types/${id}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete skin type:", error);
    return NextResponse.json(
      { message: "Gagal menghapus skin type" },
      { status: 500 }
    );
  }
}
