"use client";

import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { BackgroundLeaf, LeafLogo } from "./icons";
import { RegisterForm } from "./register-form";
import { RegisterShowcase } from "./register-showcase";

export function RegisterView() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[#f7fbf8] px-4 py-6 text-zinc-950 sm:px-6'>
      <div className='absolute -left-20 top-14 h-72 w-72 rounded-full bg-emerald-100/80 blur-3xl' />
      <div className='absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl' />
      <div className='absolute bottom-0 right-20 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl' />
      <BackgroundLeaf className='pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 opacity-25 blur-[1px] sm:h-52 sm:w-52' />
      <BackgroundLeaf className='pointer-events-none absolute right-12 top-10 h-24 w-24 -rotate-12 opacity-15 blur-[1px]' />
      <BackgroundLeaf className='pointer-events-none absolute -bottom-10 left-8 h-36 w-36 rotate-[-28deg] opacity-20 blur-[1px] sm:h-48 sm:w-48' />

      <div className='relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-375 items-center gap-8 lg:grid-cols-[410px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)]'>
        <section className='rounded-4xl border border-zinc-200/70 bg-white px-8 py-10 shadow-2xl shadow-emerald-950/10 sm:px-10'>
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
              Buat Akun Anda
            </h1>
            <p className='mt-3 max-w-xs text-sm leading-6 text-zinc-600'>
              Mulai analisis kondisi kulit dengan teknologi berbasis AI.
            </p>
          </div>

          <RegisterForm />

          <p className='mt-5 text-center text-sm text-zinc-500'>
            Mendaftar sebagai dokter?{" "}
            <Link
              href={ROUTES.REGISTER_DOCTOR}
              className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
            >
              Buat akun dokter
            </Link>
          </p>

          <div className='my-5 flex items-center gap-3'>
            <div className='h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-zinc-200' />
            <span className='rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400'>
              atau
            </span>
            <div className='h-px flex-1 bg-linear-to-l from-transparent via-zinc-200 to-zinc-200' />
          </div>

          <p className='text-center text-sm text-zinc-500'>
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.LOGIN}
              className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
            >
              Masuk
            </Link>
          </p>
        </section>

        <RegisterShowcase />
      </div>
    </main>
  );
}
