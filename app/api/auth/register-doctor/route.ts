import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getStringValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop();

  if (!extension) {
    return "pdf";
  }

  return extension.toLowerCase();
}

function isDuplicateEmailError(message: string | undefined) {
  if (!message) {
    return false;
  }

  const lowerMessage = message.toLowerCase();

  return (
    lowerMessage.includes("already") ||
    lowerMessage.includes("registered") ||
    lowerMessage.includes("exists") ||
    lowerMessage.includes("duplicate") ||
    lowerMessage.includes("user already")
  );
}

export async function POST(request: NextRequest) {
  let createdDoctorId: string | null = null;
  let uploadedFilePath: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();

    const fullName = getStringValue(formData.get("fullName"));
    const email = getStringValue(formData.get("email")).toLowerCase();
    const password = getStringValue(formData.get("password"));
    const strNumber = getStringValue(formData.get("strNumber"));
    const specialization = getStringValue(formData.get("specialization"));
    const verificationDocument = formData.get("verificationDocument");

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama lengkap wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter.",
        },
        { status: 400 },
      );
    }

    if (!strNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor STR / identitas dokter wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!specialization) {
      return NextResponse.json(
        {
          success: false,
          message: "Spesialisasi wajib dipilih.",
        },
        { status: 400 },
      );
    }

    if (!(verificationDocument instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dokumen verifikasi wajib diupload.",
        },
        { status: 400 },
      );
    }

    if (verificationDocument.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran dokumen maksimal 5MB.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(verificationDocument.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format dokumen harus PDF, JPG, JPEG, atau PNG.",
        },
        { status: 400 },
      );
    }

    const { data: createdUserData, error: createUserError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "doctor",
        },
      });

    if (createUserError || !createdUserData.user) {
      console.error("Failed to create doctor auth user:", {
        message: createUserError?.message,
      });

      const duplicateEmail = isDuplicateEmailError(createUserError?.message);

      return NextResponse.json(
        {
          success: false,
          message: duplicateEmail
            ? "Email sudah terdaftar."
            : createUserError?.message || "Gagal membuat akun dokter.",
        },
        { status: duplicateEmail ? 409 : 500 },
      );
    }

    const doctorId = createdUserData.user.id;
    createdDoctorId = doctorId;

    const fileExtension = getFileExtension(verificationDocument.name);
    const filePath = `${doctorId}/${Date.now()}-verification.${fileExtension}`;
    uploadedFilePath = filePath;

    const fileBuffer = await verificationDocument.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("doctor-verification-documents")
      .upload(filePath, fileBuffer, {
        contentType: verificationDocument.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload doctor verification document:", {
        message: uploadError.message,
        name: uploadError.name,
      });

      await supabase.auth.admin.deleteUser(doctorId);

      return NextResponse.json(
        {
          success: false,
          message: `Gagal mengupload dokumen verifikasi: ${uploadError.message}`,
        },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("doctor-verification-documents")
      .getPublicUrl(filePath);

    const now = new Date().toISOString();

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: doctorId,
        full_name: fullName,
        email,
        role: "doctor",
        is_active: false,
        created_at: now,
      },
      {
        onConflict: "id",
      },
    );

    if (profileError) {
      console.error("Failed to create doctor profile:", {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
      });

      await supabase.storage
        .from("doctor-verification-documents")
        .remove([filePath]);

      await supabase.auth.admin.deleteUser(doctorId);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal membuat profil dokter.",
        },
        { status: 500 },
      );
    }

    const { error: verificationError } = await supabase
      .from("doctor_verifications")
      .insert({
        doctor_id: doctorId,
        str_number: strNumber,
        specialization,
        document_url: publicUrl,
        verification_status: "pending",
        rejection_reason: null,
        revision_note: null,
        reviewed_by: null,
        reviewed_at: null,
        created_at: now,
        updated_at: now,
      });

    if (verificationError) {
      console.error("Failed to create doctor verification:", {
        message: verificationError.message,
        details: verificationError.details,
        hint: verificationError.hint,
        code: verificationError.code,
      });

      await supabase.storage
        .from("doctor-verification-documents")
        .remove([filePath]);

      await supabase.auth.admin.deleteUser(doctorId);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal membuat data verifikasi dokter.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Registrasi dokter berhasil. Silakan login untuk melihat status verifikasi.",
      data: {
        doctorId,
        email,
      },
    });
  } catch (error) {
    console.error("Register doctor API error:", error);

    try {
      const supabase = getSupabaseAdmin();

      if (uploadedFilePath) {
        await supabase.storage
          .from("doctor-verification-documents")
          .remove([uploadedFilePath]);
      }

      if (createdDoctorId) {
        await supabase.auth.admin.deleteUser(createdDoctorId);
      }
    } catch (cleanupError) {
      console.error("Register doctor cleanup error:", cleanupError);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}
