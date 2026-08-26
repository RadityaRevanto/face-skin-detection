import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { fetchApi } from "@/lib/api/server-client";

// POST /api/doctor/verifications — ajukan verifikasi dokter (multipart).
// Kontrak Laravel: POST /v1/doctor-verifications (documents.* wajib saat submit).
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetchApi("doctor-verifications", {
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
        : "Gagal mengirim pengajuan verifikasi.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
