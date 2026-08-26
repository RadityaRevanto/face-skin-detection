"use client";

import Link from "next/link";
import { type FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";

function HashIcon() {
  return (
    <svg aria-hidden='true' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.8'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5' />
    </svg>
  );
}

function LeafLogo() {
  return (
    <svg aria-hidden='true' className='h-9 w-9' viewBox='0 0 48 48' fill='none'>
      <path d='M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z' fill='#10B981' />
      <path d='M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z' fill='#047857' />
      <path d='M12 31.5c6.6-8.1 13.5-14.4 24-20.4' stroke='white' strokeLinecap='round' strokeWidth='2' />
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

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || ""; // Can be passed from register

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Automatically request OTP when component loads if coming from register
  useEffect(() => {
    if (email) {
      handleResendOTP();
    }
  }, [email]); // Only run when email is available

  async function handleResendOTP() {
    if (isResending) return;
    setIsResending(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/auth/verify-email/send", {
        method: "POST",
      });
      const data = await response.json();

      if (data.meta?.message || data.success) {
        setMessage(data.meta?.message || "Kode OTP telah dikirim ke email Anda.");
        setIsError(false);
      } else {
        setMessage(data.message || "Gagal mengirim OTP.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan.");
      setIsError(true);
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const otp = String(formData.get("otp") || "").trim();

    if (otp.length !== 6) {
      setMessage("Kode OTP harus 6 digit.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();

      if (data.meta?.message || data.success) {
        setMessage(data.meta?.message || "Email berhasil diverifikasi.");
        setIsError(false);
        // Redirect to login after success
        setTimeout(() => {
          router.push(ROUTES.LOGIN); // Or home, but login is safer since registerAction logs them in
        }, 2000);
      } else {
        setMessage(data.message || "Kode OTP tidak valid atau kedaluwarsa.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan.");
      setIsError(true);
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
            <span className='block text-base font-bold tracking-tight'>Skin Detection</span>
            <span className='block text-xs font-medium text-emerald-600'>Keamanan Akun</span>
          </span>
        </Link>

        <div className='mb-7'>
          <h1 className='text-2xl font-bold tracking-[-0.03em] sm:text-3xl'>Verifikasi Email</h1>
          <p className='mt-2 text-sm leading-6 text-zinc-600'>
            Masukkan 6 digit kode OTP yang telah dikirim ke kotak masuk email Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {message ? (
            <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {message}
            </div>
          ) : null}

          <div className='space-y-2'>
            <Label htmlFor='otp'>Kode OTP</Label>
            <div className='relative'>
              <FieldIcon><HashIcon /></FieldIcon>
              <Input
                id='otp'
                name='otp'
                type='text'
                maxLength={6}
                placeholder='123456'
                className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500 font-mono tracking-widest text-center text-xl'
                required
                disabled={isLoading || (!isError && !!message && message.includes("berhasil"))}
              />
            </div>
          </div>

          <Button
            variant='success'
            className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800 mt-4'
            disabled={isLoading || (!isError && !!message && message.includes("berhasil"))}
            type='submit'
          >
            {isLoading ? (
              <><span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white mr-2' />Memverifikasi...</>
            ) : "Verifikasi"}
          </Button>
        </form>

        <p className='text-center text-sm text-zinc-500 mt-6'>
          Belum menerima kode?{" "}
          <button 
            type="button"
            onClick={handleResendOTP}
            disabled={isResending}
            className='font-semibold text-emerald-700 hover:underline disabled:opacity-50'
          >
            {isResending ? "Mengirim..." : "Kirim Ulang"}
          </button>
        </p>
      </section>
    </main>
  );
}
