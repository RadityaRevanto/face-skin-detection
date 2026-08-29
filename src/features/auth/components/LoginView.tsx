"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { loginAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
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
      const result = await loginAction(formData);

      if (!result.success || !result.user) {
        setErrorMessage(result.message || "Email atau password salah.");
        return;
      }

      const profile = result.user;

      if (profile.email_verified === false) {
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
        return;
      }

      if (profile.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }

      if (profile.role === "doctor") {
        if (profile.verification_status === "approved") {
          window.location.href = "/doctor/dashboard";
        } else {
          window.location.href = "/doctor/verification-status";
        }
        return;
      }

      window.location.href = "/user/home";

    } catch (error) {
      console.error("Login submit error:", error);
      setErrorMessage("Terjadi kesalahan saat login.");
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
              Skin Detection
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
