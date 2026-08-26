import { NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  try {
    await requireAdminProfile();
    const { id } = await params;
    const body = await request.json();

    const reason = String(body.reason || "").trim();

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          message: "Alasan penolakan wajib diisi.",
        },
        { status: 400 },
      );
    }

    const res = await fetchApi(`/doctor-verifications/${id}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "rejected",
        rejection_reason: reason,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Dokter berhasil ditolak.",
      data: res.data,
    });
  } catch (error: any) {
    console.error("Reject doctor verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server saat reject dokter.",
      },
      { status: error.status || 500 },
    );
  }
}
