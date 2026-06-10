import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type CreateRecommendationBody = {
  concernId?: string;
  productId?: string | null;
  title?: string;
  recommendationText?: string;
  priorityLevel?: "low" | "medium" | "high";
  isActive?: boolean;
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

export async function POST(request: NextRequest) {
  try {
    const { supabase, doctor, response } = await getDoctorProfile();

    if (response || !doctor) {
      return response;
    }

    const body = (await request.json()) as CreateRecommendationBody;

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

    const now = new Date().toISOString();

    const { data: recommendation, error: recommendationError } = await supabase
      .from("skin_recommendations")
      .insert({
        concern_id: concernId,
        product_id: productId,
        doctor_id: doctor.id,
        title,
        recommendation_text: recommendationText,
        priority_level: priorityLevel,
        is_active: isActive,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (recommendationError) {
      console.error("Failed to create recommendation:", {
        message: recommendationError.message,
        details: recommendationError.details,
        hint: recommendationError.hint,
        code: recommendationError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: recommendationError.message || "Gagal membuat rekomendasi.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil dibuat.",
      data: recommendation,
    });
  } catch (error) {
    console.error("Create recommendation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}
