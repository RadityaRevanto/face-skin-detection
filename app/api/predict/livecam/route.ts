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

// POST /api/predict/livecam
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
    const croppedFile = formData.get("cropped_face") as File | null;

    if (!croppedFile) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Cropped face image tidak ditemukan" },
        { status: 400 }
      );
    }

    // Send to FastAPI ML service — /predict-crop (no YOLO, direct inference)
    const mlFormData = new FormData();
    mlFormData.append("file", croppedFile);

    const mlResponse = await fetch(
      `${process.env.NEXT_PUBLIC_ML_API_URL}/predict-crop`,
      { method: "POST", body: mlFormData }
    );

    if (!mlResponse.ok) {
      const detail = await mlResponse.text().catch(() => "unknown");
      console.error("ML service error:", mlResponse.status, detail);
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
      .ilike("name", predictionResult.predicted_class)
      .eq("is_active", true)
      .maybeSingle();

    let recommendations: unknown[] = [];
    if (concern) {
      const { data: recs } = await supabase
        .from("skin_recommendations")
        .select("id, title, recommendation_text, priority_level, skincare_products(*)")
        .eq("concern_id", concern.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      recommendations = recs ?? [];
    }

    const fileName = `${user.id}/livecam_${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(fileName, croppedFile);

    if (uploadError) {
      console.error("Failed to upload livecam image:", uploadError);
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
        scan_mode: "livecam_yolo",
        image_url: publicUrl.publicUrl,
        cropped_image_url: publicUrl.publicUrl,
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
      console.error("Failed to save livecam history:", historyError);
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
        scan_mode: "livecam_yolo",
        image_url: publicUrl.publicUrl,
        cropped_image_url: publicUrl.publicUrl,
        history_id: history.id,
      },
    });
  } catch (error) {
    console.error("Livecam predict error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
