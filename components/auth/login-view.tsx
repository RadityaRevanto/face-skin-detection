"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
type LoginResponse = {
  success?: boolean;
  message?: string;
  redirectTo?: string;
};

function MailIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M4.5 7.5 12 12.75 19.5 7.5M5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v7.5A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6Z'
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.5 10.5V7.875a4.5 4.5 0 0 0-9 0V10.5M6.75 10.5h10.5A1.5 1.5 0 0 1 18.75 12v6A1.5 1.5 0 0 1 17.25 19.5H6.75A1.5 1.5 0 0 1 5.25 18v-6a1.5 1.5 0 0 1 1.5-1.5Z'
      />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden?: boolean }) {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      {hidden ? (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3.98 8.22A10.5 10.5 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.53 0 2.91-.44 4.11-1.08M6.53 6.53C8.02 5.72 9.84 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75a12.34 12.34 0 0 1-2.67 3.35M3 3l18 18'
        />
      ) : (
        <>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.25 12S6 5.25 12 5.25 21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
          />
        </>
      )}
    </svg>
  );
}

function LeafLogo() {
  return (
    <svg aria-hidden='true' className='h-9 w-9' viewBox='0 0 48 48' fill='none'>
      <path
        d='M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z'
        fill='#10B981'
      />
      <path
        d='M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z'
        fill='#047857'
      />
      <path
        d='M12 31.5c6.6-8.1 13.5-14.4 24-20.4'
        stroke='white'
        strokeLinecap='round'
        strokeWidth='2'
      />
    </svg>
  );
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'>
      {children}
    </span>
  );
}

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
      const supabase = createClient();

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError || !loginData.user) {
        setErrorMessage(loginError?.message || "Email atau password salah.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, is_active")
        .eq("id", loginData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Failed to fetch profile after login:", {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code,
        });

        setErrorMessage("Gagal mengambil data profil.");
        return;
      }

      if (!profile) {
        await supabase.auth.signOut();
        setErrorMessage("Profil akun tidak ditemukan.");
        return;
      }

      if (profile.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }

      if (profile.role === "user") {
        if (profile.is_active === false) {
          await supabase.auth.signOut();
          setErrorMessage("Akun user belum aktif.");
          return;
        }

        window.location.href = "/user/home";
        return;
      }

      if (profile.role === "doctor") {
        const { data: verification, error: verificationError } = await supabase
          .from("doctor_verifications")
          .select("doctor_id, verification_status")
          .eq("doctor_id", profile.id)
          .maybeSingle();

        if (verificationError) {
          console.error("Failed to fetch doctor verification after login:", {
            message: verificationError.message,
            details: verificationError.details,
            hint: verificationError.hint,
            code: verificationError.code,
          });

          setErrorMessage("Gagal mengambil status verifikasi dokter.");
          return;
        }

        const verificationStatus =
          verification?.verification_status?.toLowerCase().trim() || "pending";

        if (verificationStatus === "approved" && profile.is_active !== false) {
          window.location.href = "/doctor/dashboard";
          return;
        }

        window.location.href = "/doctor/verification-status";
        return;
      }

      await supabase.auth.signOut();
      setErrorMessage("Role akun tidak dikenali.");
    } catch (error) {
      console.error("Login submit error:", error);
      setErrorMessage("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7fbf8] px-4 py-8 text-zinc-950'>
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {errorMessage ? (
            <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'>
              {errorMessage}
            </div>
          ) : null}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <FieldIcon>
                <MailIcon />
              </FieldIcon>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Masukkan email'
                autoComplete='email'
                className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500'
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <FieldIcon>
                <LockIcon />
              </FieldIcon>
              <Input
                id='password'
                name='password'
                type={showPassword ? "text" : "password"}
                placeholder='Masukkan password'
                autoComplete='current-password'
                className='h-12 rounded-xl pl-10 pr-10 focus-visible:ring-emerald-500'
                required
                disabled={isLoading}
              />
              <button
                type='button'
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                onClick={() => setShowPassword((value) => !value)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60'
                disabled={isLoading}
              >
                <EyeIcon hidden={showPassword} />
              </button>
            </div>

            <div className='text-right'>
              <Link
                href='#'
                className='text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline'
              >
                Lupa password?
              </Link>
            </div>
          </div>

          <Button
            variant='success'
            className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800'
            disabled={isLoading}
            type='submit'
          >
            {isLoading ? (
              <>
                Memproses...
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        <div className='my-5 flex items-center gap-3'>
          <div className='h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-zinc-200' />
          <span className='rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400'>
            atau
          </span>
          <div className='h-px flex-1 bg-linear-to-l from-transparent via-zinc-200 to-zinc-200' />
        </div>

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
