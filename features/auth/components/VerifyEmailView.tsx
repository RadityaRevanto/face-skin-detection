"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { authService } from "../services/authService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { LeafLogo } from "./BrandIcons";
import { VerifyEmailForm } from "./VerifyEmailForm";

export function VerifyEmailView() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire sekali per email; fungsi memakai state guard sendiri
  }, [email]);

  async function handleResendOTP() {
    if (isResending) return;
    setIsResending(true);
    setMessage("");
    setIsError(false);

    try {
      const data = await authService.sendEmailVerification();

      if (data?.meta?.message) {
        setMessage(String(data.meta.message));
        setIsError(false);
      } else {
        setMessage("Gagal mengirim OTP.");
        setIsError(true);
      }
    } catch (error) {
      setMessage(getUserFriendlyErrorMessage(error));
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
      const data = await authService.verifyEmail({ otp });

      if (data?.meta?.message) {
        setMessage(String(data.meta.message));
        setIsError(false);

        // Refresh cache profile & auth state agar banner "belum verifikasi"
        // hilang dan dashboard membaca status terbaru.
        await authService.me();
        queryClient.invalidateQueries({ queryKey: ["profile"] });

        // User sudah login — langsung ke dashboard, tidak perlu login ulang.
        setTimeout(() => {
          router.push("/user/home");
        }, 1500);
      } else {
        setMessage("Kode OTP tidak valid atau kedaluwarsa.");
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

      <section className='relative w-full max-w-md rounded-4xl border border-zinc-200/70 bg-white px-8 py-10 shadow-sm sm:px-10'>
        <Link href={ROUTES.HOME} className='mb-10 flex items-center gap-3'>
          <LeafLogo />
          <span>
            <span className='block text-base font-bold tracking-tight'>Skincek</span>
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
