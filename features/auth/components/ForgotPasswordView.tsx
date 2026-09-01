"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

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

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'>
      {children}
    </span>
  );
}

export function ForgotPasswordView() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setMessage("Email wajib diisi.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.forgotPassword({ email });

      if (data?.meta?.message) {
        setMessage(String(data.meta.message));
        setIsError(false);
        // Redirect to reset password after 2 seconds, passing email in query params
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setMessage("Gagal mengirim permintaan.");
        setIsError(true);
      }
    } catch (error) {
      setMessage(getUserFriendlyErrorMessage(error));
      setIsError(true);
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
              Lupa Password
            </span>
          </span>
        </Link>

        <div className='mb-7'>
          <h1 className='text-3xl font-bold tracking-[-0.03em] sm:text-4xl'>
            Reset Password
          </h1>
          <p className='mt-3 text-sm leading-6 text-zinc-600'>
            Masukkan email Anda dan kami akan mengirimkan kode OTP untuk mengatur ulang password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {message ? (
            <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {message}
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
                placeholder='Masukkan email terdaftar'
                autoComplete='email'
                className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500'
                required
                disabled={isLoading || (!isError && !!message)}
              />
            </div>
          </div>

          <Button
            variant='success'
            className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800 mt-2'
            disabled={isLoading || (!isError && !!message)}
            type='submit'
          >
            {isLoading ? (
              <>
                Memproses...
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              </>
            ) : (
              "Kirim Kode OTP"
            )}
          </Button>
        </form>

        <p className='text-center text-sm text-zinc-500 mt-6'>
          Ingat password Anda?{" "}
          <Link
            href={ROUTES.LOGIN}
            className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
          >
            Kembali ke Login
          </Link>
        </p>
      </section>
    </main>
  );
}
