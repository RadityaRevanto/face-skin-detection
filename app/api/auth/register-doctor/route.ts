import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // --- Field mapping: frontend camelCase → backend snake_case ---
    const fullName = formData.get("full_name");
    if (fullName) {
      formData.set("full_name", String(fullName));
    }

    // Ensure privacy_consent is accepted
    formData.set("privacy_consent", "true");

    // Forward to Laravel backend
    const response = await fetchApi<{
      data?: { user?: Record<string, unknown>; token?: string };
      meta?: { message?: string };
    }>("register-doctor", {
      method: "POST",
      body: formData,
    });

    return NextResponse.json({
      success: true,
      message:
        response.meta?.message ||
        "Registrasi dokter berhasil. Silakan cek email untuk verifikasi OTP.",
      data: response.data,
    });
  } catch (error: unknown) {
    console.error("Register doctor API error:", error);

    const status = (error as { status?: number }).status ?? 500;
    const errData = (error as { data?: { message?: string; errors?: Record<string, string[]> } }).data;
    const message =
      errData?.message ||
      (error instanceof Error ? error.message : "Gagal membuat akun dokter.");

    // Pass through validation errors from Laravel
    const errors = errData?.errors ?? null;

    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status: status >= 400 && status < 600 ? status : 500 },
    );
  }
}
