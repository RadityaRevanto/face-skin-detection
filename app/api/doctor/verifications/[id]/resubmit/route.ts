import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// POST /api/doctor/verifications/[id]/resubmit — kirim revisi (multipart).
// Kontrak Laravel: POST /v1/doctor-verifications/{uuid}/resubmit,
// hanya untuk status needs_revision; documents opsional (clear+replace).
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const formData = await request.formData();

    const response = await fetchApi(`doctor-verifications/${id}/resubmit`, {
      method: "POST",
      body: formData,
    });

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    );
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError
        ? error.message
        : "Gagal mengirim revisi verifikasi.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
