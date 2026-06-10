import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RecommendationBody = {
  concernId?: string;
  productId?: string | null;
  title?: string;
  recommendationText?: string;
  priorityLevel?: "low" | "medium" | "high";
  isActive?: boolean;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getDoctorProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      doctor: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Kamu belum login.",
        },
        { status: 401 },
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      supabase,
      doctor: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Profil tidak ditemukan.",
        },
        { status: 404 },
      ),
    };
  }

  if (profile.role !== "doctor") {
    return {
      supabase,
      doctor: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Akses hanya untuk dokter.",
        },
        { status: 403 },
      ),
    };
  }

  if (profile.is_active === false) {
    return {
      supabase,
      doctor: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Akun dokter belum aktif.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabase,
    doctor: profile,
    response: null,
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, doctor, response } = await getDoctorProfile();

    if (response || !doctor) {
      return response;
    }

    const body = (await request.json()) as RecommendationBody;

    const concernId = body.concernId?.trim();
    const productId = body.productId?.trim() || null;
    const title = body.title?.trim();
    const recommendationText = body.recommendationText?.trim();
    const priorityLevel = body.priorityLevel ?? "medium";
    const isActive = body.isActive ?? true;

    if (!concernId) {
      return NextResponse.json(
        {
          success: false,
          message: "Skin concern wajib dipilih.",
        },
        { status: 400 },
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul rekomendasi wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!recommendationText) {
      return NextResponse.json(
        {
          success: false,
          message: "Catatan rekomendasi wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!["low", "medium", "high"].includes(priorityLevel)) {
      return NextResponse.json(
        {
          success: false,
          message: "Priority level tidak valid.",
        },
        { status: 400 },
      );
    }

    const { data: existingRecommendation, error: existingError } =
      await supabase
        .from("skin_recommendations")
        .select("id")
        .eq("id", id)
        .eq("doctor_id", doctor.id)
        .maybeSingle();

    if (existingError || !existingRecommendation) {
      return NextResponse.json(
        {
          success: false,
          message: "Data rekomendasi tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const { data: concern, error: concernError } = await supabase
      .from("skin_concerns")
      .select("id")
      .eq("id", concernId)
      .maybeSingle();

    if (concernError || !concern) {
      return NextResponse.json(
        {
          success: false,
          message: "Skin concern tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (productId) {
      const { data: product, error: productError } = await supabase
        .from("skincare_products")
        .select("id")
        .eq("id", productId)
        .eq("doctor_id", doctor.id)
        .maybeSingle();

      if (productError || !product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Produk skincare tidak ditemukan atau bukan milik dokter ini.",
          },
          { status: 404 },
        );
      }
    }

    const { data: recommendation, error: updateError } = await supabase
      .from("skin_recommendations")
      .update({
        concern_id: concernId,
        product_id: productId,
        title,
        recommendation_text: recommendationText,
        priority_level: priorityLevel,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .select("id")
      .single();

    if (updateError) {
      console.error("Failed to update recommendation:", {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: updateError.message || "Gagal mengubah rekomendasi.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil diperbarui.",
      data: recommendation,
    });
  } catch (error) {
    console.error("Update recommendation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, doctor, response } = await getDoctorProfile();

    if (response || !doctor) {
      return response;
    }

    const { data: existingRecommendation, error: existingError } =
      await supabase
        .from("skin_recommendations")
        .select("id")
        .eq("id", id)
        .eq("doctor_id", doctor.id)
        .maybeSingle();

    if (existingError || !existingRecommendation) {
      return NextResponse.json(
        {
          success: false,
          message: "Data rekomendasi tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabase
      .from("skin_recommendations")
      .delete()
      .eq("id", id)
      .eq("doctor_id", doctor.id);

    if (deleteError) {
      console.error("Failed to delete recommendation:", {
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: deleteError.message || "Gagal menghapus rekomendasi.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete recommendation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}
