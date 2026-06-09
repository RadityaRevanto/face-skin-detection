import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        user: null,
        profile: null,
      },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      {
        success: false,
        message: "Profile tidak ditemukan.",
        user,
        profile: null,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    user,
    profile,
  });
}
