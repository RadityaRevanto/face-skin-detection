"use client";

import Link from "next/link";
import { type FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { LeafLogo } from "./BrandIcons";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    const email = initialEmail;
    const otp = String(formData.get("otp") || "").trim();
    const password = String(formData.get("password") || "");
    const password_confirmation = String(formData.get("password_confirmation") || "");

    if (!otp || !password || !password_confirmation) {
      setMessage("Semua kolom wajib diisi.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setMessage("Kode OTP harus 6 digit.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, password_confirmation }),
      });
      const data = await response.json();

      if (data.meta?.message || data.success) {
        setMessage(data.meta?.message || "Password berhasil diperbarui.");
        setIsError(false);
        // Redirect to login after success
        setTimeout(() => {
          router.push(ROUTES.LOGIN);
        }, 2000);
      } else {
        setMessage(data.message || "Gagal mereset password.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Jika tidak ada email, arahkan kembali ke lupa sandi
  useEffect(() => {
    if (!initialEmail) {
      router.push("/forgot-password");
    }
  }, [initialEmail, router]);

  if (!initialEmail) return null;

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
            <span className='block text-xs font-medium text-emerald-600'>Buat Sandi Baru</span>
          </span>
        </Link>

        <div className='mb-7'>
          <h1 className='text-2xl font-bold tracking-[-0.03em] sm:text-3xl'>Atur Ulang Sandi</h1>
          <p className='mt-2 text-sm leading-6 text-zinc-600'>
            Masukkan kode 6 digit yang dikirim ke <span className="font-semibold text-emerald-700">{initialEmail}</span> beserta sandi baru Anda.
          </p>
        </div>

        <ResetPasswordForm
          initialEmail={initialEmail}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          isLoading={isLoading}
          message={message}
          isError={isError}
          handleSubmit={handleSubmit}
        />

        <p className='text-center text-sm text-zinc-500 mt-6'>
          Tidak menerima email?{" "}
          <Link href="/forgot-password" className='font-semibold text-emerald-700 hover:underline'>
            Kirim ulang OTP
          </Link>
        </p>
      </section>
    </main>
  );
}
