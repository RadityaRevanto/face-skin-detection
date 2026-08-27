import { NextRequest, NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ApiError } from "@/lib/api/errors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    await requireAdminProfile();

    const response = await fetchApi(`/admin/users/${id}/toggle-active`, {
      method: "PATCH",
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Gagal mengubah status dokter.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
