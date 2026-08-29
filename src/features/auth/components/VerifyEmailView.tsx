"use client";

import Link from "next/link";
import { type FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { LeafLogo } from "./BrandIcons";
import { VerifyEmailForm } from "./VerifyEmailForm";

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
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-shell px-4 py-8 text-zinc-950'>
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

        <VerifyEmailForm
          isLoading={isLoading}
          message={message}
          isError={isError}
          handleSubmit={handleSubmit}
        />

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
