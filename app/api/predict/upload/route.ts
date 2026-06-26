import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PredictionResult } from "@/lib/types";

function normalizeSeverityLevel(level: string) {
  const value = level.toLowerCase();

  if (value === "high" || value === "severe") {
    return "severe";
  }

  if (value === "medium" || value === "moderate") {
    return "moderate";
  }

  return "mild";
}

function normalizeSeverityScore(score: number) {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.round(score <= 1 ? score * 100 : score);
}

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
    const normalizedPrediction = {
      ...predictionResult,
      severity_score: normalizeSeverityScore(predictionResult.severity_score),
      severity_level: normalizeSeverityLevel(predictionResult.severity_level),
    };

    // Fetch recommendations from DB
    const { data: concern } = await supabase
      .from("skin_concerns")
      .select("id")
      .ilike("name", normalizedPrediction.predicted_class)
      .eq("is_active", true)
      .maybeSingle();

    let recommendations: unknown[] = [];
    if (concern) {
      const { data: recs } = await supabase
        .from("skin_recommendations")
        .select("*, skincare_products(*)")
        .eq("concern_id", concern.id)
        .eq("is_active", true);
      recommendations = recs ?? [];
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${user.id}/upload_${Date.now()}_${safeFileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gagal mengupload gambar ke history" },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("skin-images")
      .getPublicUrl(uploadData.path);

    const { data: history, error: historyError } = await supabase
      .from("prediction_histories")
      .insert({
        user_id: user.id,
        scan_mode: "upload_image",
        image_url: publicUrl.publicUrl,
        cropped_image_url: null,
        predicted_class: normalizedPrediction.predicted_class,
        confidence: normalizedPrediction.confidence,
        probabilities: normalizedPrediction.probabilities,
        severity_score: normalizedPrediction.severity_score,
        severity_level: normalizedPrediction.severity_level,
        model_used: normalizedPrediction.model_used,
      })
      .select("id")
      .single();

    if (historyError) {
      console.error("Failed to save upload history:", historyError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gagal menyimpan hasil pemeriksaan ke history" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        prediction: normalizedPrediction,
        recommendations,
        scan_mode: "upload_image",
        image_url: publicUrl.publicUrl,
        cropped_image_url: null,
        history_id: history.id,
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
