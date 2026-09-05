"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";

import { ROUTES } from "@/lib/constants";
import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { useRouter } from "next/navigation";
import { customToast } from "@/lib/custom-toast";
import { LeafLogo } from "./BrandIcons";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });

      if (!response.data?.user || !response.data?.token) {
        setErrorMessage("Email atau password salah.");
        return;
      }

      // Login response tidak menyertakan role — ambil dari GET /profile.
      const profile = await authService.me();

      if (!profile.data) {
        setErrorMessage("Gagal memuat profil pengguna.");
        return;
      }

      const emailVerified =
        Boolean(profile.data.email_verified) ||
        Boolean((response.data.user as { email_verified_at?: string | null }).email_verified_at);

      // Verifikasi email hanya diwajibkan untuk role user (fitur scan/chat
      // meng-enforce ini per-endpoint di BE). Admin & doctor tetap masuk
      // dashboard — kalau tidak, terjadi ping-pong /verify-email ↔
      // RedirectIfAuthenticated tanpa toast selamat datang.
      if (!emailVerified && profile.data.role === "user") {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      customToast.success("Selamat datang!", {
        description: "Login berhasil. Selamat datang kembali!",
      });

      if (profile.data.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      if (profile.data.role === "doctor") {
        if (profile.data.verification_status === "approved") {
          router.push("/doctor/dashboard");
        } else {
          router.push("/doctor/verification-status");
        }
        return;
      }

      router.push("/user/home");

    } catch (error) {
      console.error("Login submit error:", error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-shell px-4 py-8 text-zinc-950'>
      <div className='absolute -left-20 top-14 h-72 w-72 rounded-full bg-emerald-100/80 blur-3xl' />
      <div className='absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl' />
      <div className='absolute bottom-0 right-20 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl' />

      <section className='relative w-full max-w-md rounded-4xl border border-zinc-200/70 bg-white px-8 py-10 shadow-2xl shadow-emerald-950/10 sm:px-10'>
        <Link href={ROUTES.HOME} className='mb-10 flex items-center gap-3'>
          <LeafLogo />
          <span>
            <span className='block text-base font-bold tracking-tight'>
              Skincek
            </span>
            <span className='block text-xs font-medium text-emerald-600'>
              Analisis Kulit Berbasis AI
            </span>
          </span>
        </Link>

        <div className='mb-7'>
          <h1 className='text-3xl font-bold tracking-[-0.03em] sm:text-4xl'>
            Masuk ke Akun
          </h1>
          <p className='mt-3 text-sm leading-6 text-zinc-600'>
            Masukkan email dan password untuk mengakses dashboard Anda.
          </p>
        </div>

        <LoginForm
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          errorMessage={errorMessage}
          handleSubmit={handleSubmit}
        />

        <div className='my-5 flex items-center gap-3'>
          <div className='h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-zinc-200' />
          <span className='rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400'>
            atau
          </span>
          <div className='h-px flex-1 bg-linear-to-l from-transparent via-zinc-200 to-zinc-200' />
        </div>

        <GoogleLoginButton />

        <p className='text-center text-sm text-zinc-500'>
          Belum punya akun?{" "}
          <Link
            href={ROUTES.REGISTER}
            className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
          >
            Buat akun
          </Link>
        </p>
      </section>
    </main>
  );
}
