import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PredictionResult } from "@/lib/types";

// POST /api/predict/upload
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Format file tidak didukung. Gunakan JPG, JPEG, atau PNG." },
        { status: 400 }
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ukuran file melebihi 5MB" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gagal mengupload gambar" },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("skin-images")
      .getPublicUrl(uploadData.path);

    // Send to FastAPI ML service
    const mlFormData = new FormData();
    mlFormData.append("file", file);

    const mlResponse = await fetch(
      `${process.env.NEXT_PUBLIC_ML_API_URL}/predict`,
      { method: "POST", body: mlFormData }
    );

    if (!mlResponse.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "ML service error" },
        { status: 502 }
      );
    }

    const predictionResult: PredictionResult = await mlResponse.json();

    // Fetch recommendations from DB
    const { data: concern } = await supabase
      .from("skin_concerns")
      .select("id")
      .eq("name", predictionResult.predicted_class)
      .single();

    let recommendations = [];
    if (concern) {
      const { data: recs } = await supabase
        .from("skin_recommendations")
        .select("*, skincare_products(*)")
        .eq("concern_id", concern.id)
        .eq("is_active", true);
      recommendations = recs ?? [];
    }

    // Save prediction history
    const { data: history, error: historyError } = await supabase
      .from("prediction_histories")
      .insert({
        user_id: user.id,
        scan_mode: "upload_image",
        image_url: publicUrl.publicUrl,
        predicted_class: predictionResult.predicted_class,
        confidence: predictionResult.confidence,
        probabilities: predictionResult.probabilities,
        severity_score: predictionResult.severity_score,
        severity_level: predictionResult.severity_level,
        model_used: predictionResult.model_used,
      })
      .select()
      .single();

    if (historyError) {
      console.error("Failed to save history:", historyError);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        prediction: predictionResult,
        recommendations,
        history_id: history?.id,
        image_url: publicUrl.publicUrl,
      },
    });
  } catch (error) {
    console.error("Upload predict error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
