import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * StatCard standar: kartu putih border, angka besar, tanpa gradient/
 * watermark/hover-scale — dashboard admin & dokter pakai komponen ini.
 */

type StatCardProps = {
  label: string;
  value: string;
  /** Baris meta kecil di bawah label (opsional). */
  helper?: string;
  /** Halaman tujuan — bila diisi, kartu menjadi <Link>. */
  href?: string;
  /** Ikon kecil di samping helper. */
  helperIcon?: React.ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  helper,
  href,
  helperIcon,
  className,
}: StatCardProps) {
  const body = (
    <div className="p-5 sm:p-6">
      <p className="text-2xl font-bold leading-none text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
      {helper ? (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          {helperIcon ? <span className="shrink-0">{helperIcon}</span> : null}
          {helper}
        </div>
      ) : null}
    </div>
  );

  const cardClass = cn(
    "rounded-2xl border border-slate-100 bg-white shadow-sm",
    href && "transition-colors hover:border-slate-200",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
