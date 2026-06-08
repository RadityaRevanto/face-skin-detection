import { NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: Params) {
  try {
    const admin = await requireAdminProfile();
    const { id } = await params;

    const supabase = await createClient();

    const { error } = await supabase
      .from("doctor_verifications")
      .update({
        verification_status: "approved",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: null,
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
      message: "Dokter berhasil di-approve.",
    });
  } catch (error) {
    console.error("Approve doctor verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat approve dokter.",
      },
      { status: 500 },
    );
  }
}
