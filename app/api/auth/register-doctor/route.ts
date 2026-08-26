import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Pastikan privacy_consent diisi agar diterima backend Laravel
    formData.set("privacy_consent", "on");

    // Mapping field jika perlu (misal frontend mengirim fullName, backend butuh full_name)
    const fullName = formData.get("fullName");
    if (fullName) {
      formData.set("full_name", fullName);
      formData.delete("fullName");
    }

    const strNumber = formData.get("strNumber");
    if (strNumber) {
      formData.set("str_number", strNumber);
      formData.delete("strNumber");
    }

    const verificationDocument = formData.get("verificationDocument");
    if (verificationDocument) {
      formData.set("documents[]", verificationDocument);
      formData.delete("verificationDocument");
    }

    // Forward ke Laravel backend
    const response = await fetchApi<{ message: string; data?: any }>("register-doctor", {
      method: "POST",
      body: formData,
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi dokter berhasil. Silakan login untuk melihat status verifikasi.",
      data: response.data,
    });
  } catch (error: any) {
    console.error("Register doctor API error:", error);

    const isConflict = error.status === 409 || error.status === 422;
    const message =
      error.data?.message || error.message || "Gagal membuat akun dokter.";

    return NextResponse.json(
      {
        success: false,
        message: message,
      },
      { status: isConflict ? 409 : 500 },
    );
  }
}
