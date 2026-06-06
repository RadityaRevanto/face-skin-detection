"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterUserPayload = {
  fullName: string;
  email: string;
  password: string;
};

type RegisterDoctorPayload = {
  fullName: string;
  email: string;
  password: string;
};

export async function loginUser(payload: LoginPayload) {
  const supabase = await createClient();

  const { email, password } = payload;

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Login berhasil.",
  };
}

export async function registerUser(payload: RegisterUserPayload) {
  const supabase = await createClient();

  const { fullName, email, password } = payload;

  if (!fullName || !email || !password) {
    return {
      success: false,
      message: "Nama, email, dan password wajib diisi.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password minimal 8 karakter.",
    };
  }

  const { error } = await supabase.auth.signUp({
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
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Registrasi berhasil. Silakan cek email jika konfirmasi email aktif.",
  };
}

export async function registerDoctor(payload: RegisterDoctorPayload) {
  const supabase = await createClient();

  const { fullName, email, password } = payload;

  if (!fullName || !email || !password) {
    return {
      success: false,
      message: "Nama, email, dan password wajib diisi.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password minimal 8 karakter.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "doctor",
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Registrasi dokter berhasil. Lanjutkan upload dokumen verifikasi.",
  };
}

export async function logoutUser() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
