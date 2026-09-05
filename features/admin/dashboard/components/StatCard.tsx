import { cn } from "@/lib/utils";

import {
  GradientStatCard,
  type GradientStatVariant,
} from "@/components/ui/gradient-stat-card";
import { DashboardIcon } from "./DashboardIcon";

/**
 * StatCard admin — pola card custom fe-simkatmawa:
 * gradient penuh + watermark ikon + teks putih + hover scale.
 *
 * Props lama dipertahankan agar call sites tidak berubah:
 * `tone` (pasangan bg+text lama) dipetakan ke varian gradient,
 * `sublabel` menjadi baris helper.
 */

/** Pemetaan tone lama → varian gradient fe-simkatmawa. */
const TONE_TO_VARIANT: Record<string, GradientStatVariant> = {
  "bg-emerald-50 text-emerald-600": "emerald",
  "bg-sky-50 text-sky-600": "sky",
  "bg-amber-50 text-amber-600": "amber",
  "bg-violet-50 text-violet-600": "violet",
  "bg-rose-50 text-rose-600": "rose",
};

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
  /** Tone ikon lama — dipetakan ke varian gradient. */
  tone: string;
  /** Halaman tujuan — bila diisi, kartu menjadi <Link>. */
  href?: string;
  /** Sublabel statis opsional — dirender sebagai helper. */
  sublabel?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  tone,
  href,
  sublabel,
  className,
}: StatCardProps) {
  const variant = TONE_TO_VARIANT[tone] ?? "navy";

  return (
    <GradientStatCard
      label={label}
      value={value}
      variant={variant}
      href={href}
      helper={sublabel}
      className={cn("h-full", className)}
      icon={<DashboardIcon name={icon} className="h-[88px] w-[88px]" />}
    />
  );
}
