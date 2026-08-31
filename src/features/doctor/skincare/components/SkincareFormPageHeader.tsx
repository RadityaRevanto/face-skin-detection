import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export function SkincareFormPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Link
        href={ROUTES.DOCTOR.SKINCARE}
        className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
      >
        <span aria-hidden='true'>←</span>
        Kembali ke Data Skincare
      </Link>

      <h1 className='mt-4 text-2xl font-bold tracking-tight text-slate-950'>
        {title}
      </h1>

      <p className='mt-1 text-sm text-slate-500'>{description}</p>
    </div>
  );
}
