import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type CreateSkincareBody = {
  concernId?: string;
  skinTypeId?: string;
  name?: string;
  category?: string;
  keyIngredients?: string;
  usageInstruction?: string;
  warning?: string | null;
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

    const body = (await request.json()) as CreateSkincareBody;

    console.log("Create skincare body:", body);

    const concernId = body.concernId?.trim();
    const skinTypeId = body.skinTypeId?.trim();
    const name = body.name?.trim();
    const category = body.category?.trim();
    const keyIngredients = body.keyIngredients?.trim();
    const usageInstruction = body.usageInstruction?.trim();
    const warning = body.warning?.trim() || null;
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

    if (!skinTypeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis kulit wajib dipilih.",
        },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama produk wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori produk wajib dipilih.",
        },
        { status: 400 },
      );
    }

    if (!keyIngredients) {
      return NextResponse.json(
        {
          success: false,
          message: "Key ingredients wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!usageInstruction) {
      return NextResponse.json(
        {
          success: false,
          message: "Instruksi penggunaan wajib diisi.",
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
      console.error("Skin concern validation failed:", {
        concernId,
        message: concernError?.message,
        details: concernError?.details,
        hint: concernError?.hint,
        code: concernError?.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Skin concern tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const { data: skinType, error: skinTypeError } = await supabase
      .from("skin_types")
      .select("id")
      .eq("id", skinTypeId)
      .maybeSingle();

    if (skinTypeError || !skinType) {
      console.error("Skin type validation failed:", {
        skinTypeId,
        message: skinTypeError?.message,
        details: skinTypeError?.details,
        hint: skinTypeError?.hint,
        code: skinTypeError?.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Jenis kulit tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    const { data: skincare, error: skincareError } = await supabase
      .from("skincare_products")
      .insert({
        doctor_id: doctor.id,
        concern_id: concernId,
        skin_type_id: skinTypeId,
        name,
        category,
        key_ingredients: keyIngredients,
        usage_instruction: usageInstruction,
        warning,
        is_active: isActive,
        created_at: now,
        updated_at: now,
      })
      .select("id, concern_id, skin_type_id")
      .single();

    if (skincareError) {
      console.error("Failed to create skincare product:", {
        message: skincareError.message,
        details: skincareError.details,
        hint: skincareError.hint,
        code: skincareError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: skincareError.message || "Gagal membuat produk skincare.",
        },
        { status: 500 },
      );
    }

    console.log("Created skincare:", skincare);

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil dibuat.",
      data: skincare,
    });
  } catch (error) {
    console.error("Create skincare API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}
