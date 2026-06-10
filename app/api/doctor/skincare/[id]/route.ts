import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateSkincareBody = {
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, doctor, response } = await getDoctorProfile();

    if (response || !doctor) {
      return response;
    }

    const body = (await request.json()) as UpdateSkincareBody;

    console.log("Update skincare body:", body);

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

    const { data: existingProduct, error: existingError } = await supabase
      .from("skincare_products")
      .select("id")
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .maybeSingle();

    if (existingError || !existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk skincare tidak ditemukan.",
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

    const { data: skincare, error: skincareError } = await supabase
      .from("skincare_products")
      .update({
        concern_id: concernId,
        skin_type_id: skinTypeId,
        name,
        category,
        key_ingredients: keyIngredients,
        usage_instruction: usageInstruction,
        warning,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .select("id, concern_id, skin_type_id")
      .single();

    if (skincareError) {
      console.error("Failed to update skincare product:", {
        message: skincareError.message,
        details: skincareError.details,
        hint: skincareError.hint,
        code: skincareError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: skincareError.message || "Gagal memperbarui produk.",
        },
        { status: 500 },
      );
    }

    console.log("Updated skincare:", skincare);

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil diperbarui.",
      data: skincare,
    });
  } catch (error) {
    console.error("Update skincare API error:", error);

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

    const { data: existingProduct, error: existingError } = await supabase
      .from("skincare_products")
      .select("id")
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .maybeSingle();

    if (existingError || !existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk skincare tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    /**
     * Karena produk kemungkinan sudah dipakai di skin_recommendations,
     * kita hapus rekomendasi yang memakai produk ini dulu agar tidak error FK.
     */
    const { error: recommendationDeleteError } = await supabase
      .from("skin_recommendations")
      .delete()
      .eq("product_id", id)
      .eq("doctor_id", doctor.id);

    if (recommendationDeleteError) {
      console.error("Failed to delete related recommendations:", {
        message: recommendationDeleteError.message,
        details: recommendationDeleteError.details,
        hint: recommendationDeleteError.hint,
        code: recommendationDeleteError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Gagal menghapus rekomendasi terkait produk ini.",
        },
        { status: 500 },
      );
    }

    const { error: productDeleteError } = await supabase
      .from("skincare_products")
      .delete()
      .eq("id", id)
      .eq("doctor_id", doctor.id);

    if (productDeleteError) {
      console.error("Failed to delete skincare product:", {
        message: productDeleteError.message,
        details: productDeleteError.details,
        hint: productDeleteError.hint,
        code: productDeleteError.code,
      });

      return NextResponse.json(
        {
          success: false,
          message: productDeleteError.message || "Gagal menghapus produk.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk skincare berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete skincare API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}
