import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const fullName = String(body.fullName || "");
  const email = String(body.email || "");
  const password = String(body.password || "");

  if (!fullName || !email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        success: false,
        message: "Password minimal 8 karakter.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "user",
      },
    },
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Registrasi berhasil.",
    user: data.user,
  });
}
