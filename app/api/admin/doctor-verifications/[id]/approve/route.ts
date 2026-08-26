import { NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: Params) {
  try {
    await requireAdminProfile();
    const { id } = await params;

    const res = await fetchApi(`/doctor-verifications/${id}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "approved",
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Dokter berhasil di-approve.",
      data: res.data,
    });
  } catch (error: any) {
    console.error("Approve doctor verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server saat approve dokter.",
      },
      { status: error.status || 500 },
    );
  }
}
