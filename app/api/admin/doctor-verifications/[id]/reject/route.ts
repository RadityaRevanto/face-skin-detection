import { NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const admin = await requireAdminProfile();
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

    const supabase = await createClient();

    const { error } = await supabase
      .from("doctor_verifications")
      .update({
        verification_status: "rejected",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
        revision_note: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dokter berhasil ditolak.",
    });
  } catch (error) {
    console.error("Reject doctor verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat reject dokter.",
      },
      { status: 500 },
    );
  }
}
