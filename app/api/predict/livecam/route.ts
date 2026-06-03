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

    // Send to FastAPI ML service
    const mlFormData = new FormData();
    mlFormData.append("file", croppedFile);

    const mlResponse = await fetch(
      `${process.env.NEXT_PUBLIC_ML_API_URL}/predict-crop`,
      { method: "POST", body: mlFormData }
    );

    if (!mlResponse.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "ML service error" },
        { status: 502 }
      );
    }

    const predictionResult: PredictionResult = await mlResponse.json();

    // Return temporary result (user confirms to save)
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        prediction: predictionResult,
        cropped_image_url: publicUrl.publicUrl,
        is_temporary: true,
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
