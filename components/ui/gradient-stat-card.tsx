import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * GradientStatCard — pola card custom fe-simkatmawa:
 * gradient penuh + watermark ikon besar putih/15 di pojok kanan bawah
 * + teks putih + hover scale.
 *
 * TIDAK memakai <Card> bawaan: cn lokal hanya join string (tanpa
 * tailwind-merge), sehingga kelas dasar Card (text-zinc-950, bg-white,
 * border) akan konflik dengan kelas gradient dan teks bisa berubah
 * hitam. Div/Link polos memastikan hanya kelas di sini yang aktif.
 */

export type GradientStatVariant =
  | "navy"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet";

export const GRADIENT_VARIANTS: Record<GradientStatVariant, string> = {
  navy: "from-[#1769aa] to-[#0F4C81]",
  emerald: "from-emerald-400 to-green-500",
  amber: "from-amber-400 to-orange-500",
  rose: "from-rose-400 to-red-500",
  sky: "from-sky-400 to-blue-500",
  violet: "from-violet-400 to-purple-500",
};

type GradientStatCardProps = {
  label: string;
  value: string;
  /** Watermark ikon di pojok kanan bawah (dirender 88px). */
  icon?: React.ReactNode;
  /** Varian gradient. */
  variant?: GradientStatVariant;
  /** Baris meta kecil di bawah label (opsional). */
  helper?: string;
  /** Halaman tujuan — bila diisi, kartu menjadi <Link>. */
  href?: string;
  /** Ikon kecil di samping helper. */
  helperIcon?: React.ReactNode;
  className?: string;
};

export function GradientStatCard({
  label,
  value,
  icon,
  variant = "navy",
  helper,
  href,
  helperIcon,
  className,
}: GradientStatCardProps) {
  const gradient = GRADIENT_VARIANTS[variant];

  const body = (
    <div className="relative p-5 sm:p-6">
      {icon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-2 block text-white/15"
        >
          {icon}
        </span>
      ) : null}

      <div className="relative z-10">
        <p className="text-2xl font-bold leading-none text-white sm:text-3xl">
          {value}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/95">{label}</p>
        {helper ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white/80">
            {helperIcon ? <span className="shrink-0">{helperIcon}</span> : null}
            {helper}
          </div>
        ) : null}
      </div>
    </div>
  );

  const cardClass = cn(
    "relative overflow-hidden rounded-2xl bg-linear-to-br text-white shadow-md",
    "transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-lg",
    href ? "cursor-pointer" : "cursor-default",
    gradient,
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
