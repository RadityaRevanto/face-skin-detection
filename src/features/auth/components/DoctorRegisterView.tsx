"use client";

import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { LeafLogo } from "./BrandIcons";
import { DoctorRegisterForm } from "./DoctorRegisterForm";
import { DoctorDashboardPreview } from "./DashboardPreview";

export function DoctorRegisterView() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-shell-alt px-4 py-6 text-zinc-950 sm:px-6'>
      <div className='absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-emerald-100/80 blur-3xl' />
      <div className='absolute right-0 top-0 h-136 w-136 rounded-full bg-emerald-200/45 blur-3xl' />
      <div className='absolute right-32 top-28 h-60 w-60 rounded-full border border-emerald-200/50' />
      <div className='absolute right-24 top-20 h-84 w-84 rounded-full border border-emerald-200/35' />

      <div className='relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1500px] items-center gap-8 lg:grid-cols-[460px_minmax(0,1fr)] xl:grid-cols-[500px_minmax(0,1fr)]'>
        <section className='rounded-4xl border border-zinc-200/70 bg-white px-5 py-6 shadow-2xl shadow-emerald-950/10 sm:px-8 sm:py-8 lg:px-10'>
          <div className='mb-6 flex items-start justify-between gap-4 sm:mb-8'>
            <Link href={ROUTES.HOME} className='flex items-center gap-2.5 sm:gap-3'>
              <span className='rounded-2xl border border-emerald-100 bg-emerald-50 p-1'>
                <LeafLogo />
              </span>
              <span>
                <span className='block text-base font-bold tracking-tight'>
                  Skincek
                </span>
                <span className='block text-xs font-medium text-emerald-600'>
                  Doctor Portal
                </span>
              </span>
            </Link>

            <span className='rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:px-3'>
              AI Powered
            </span>
          </div>

          <div className='mb-5 sm:mb-6'>
            <h1 className='text-2xl font-bold tracking-[-0.03em] sm:text-3xl lg:text-4xl'>
              Buat Akun Dokter
            </h1>
            <p className='mt-2.5 text-sm leading-6 text-zinc-600 sm:mt-3'>
              Bergabunglah dengan platform AI Skincek untuk memberikan
              layanan analisis kulit yang lebih akurat dan terpercaya.
            </p>
          </div>

          <DoctorRegisterForm />

          <p className='mt-5 text-center text-sm text-zinc-500'>
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.LOGIN}
              className='font-semibold text-emerald-700 underline-offset-4 hover:underline'
            >
              Masuk di sini
            </Link>
          </p>
        </section>

        <DoctorDashboardPreview />
      </div>
    </main>
  );
}
