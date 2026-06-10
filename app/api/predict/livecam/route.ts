import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PredictionResult } from "@/lib/types";

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

    // Upload cropped face to Supabase Storage
    const fileName = `${user.id}/livecam_${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(fileName, croppedFile);

    if (uploadError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gagal mengupload cropped image" },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("skin-images")
      .getPublicUrl(uploadData.path);

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
        .select("id, title, recommendation_text, priority_level")
        .eq("concern_id", concern.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      recommendations = recs ?? [];
    }

    // Auto-save to prediction_histories
    const { data: history, error: historyError } = await supabase
      .from("prediction_histories")
      .insert({
        user_id: user.id,
        scan_mode: "livecam_yolo",
        image_url: publicUrl.publicUrl,
        cropped_image_url: publicUrl.publicUrl,
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
        cropped_image_url: publicUrl.publicUrl,
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
