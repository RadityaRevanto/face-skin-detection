import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

type RouteContext = {
  params: Promise<{ uuid: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { uuid } = await context.params;

    const result = await fetchApi(`/doctors/${uuid}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch doctor detail error:", error);

    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengambil profil dokter";

    return NextResponse.json(
      { success: false, message },
      { status },
    );
  }
}
