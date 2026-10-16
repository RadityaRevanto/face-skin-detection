"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StatCard — kartu KPI (Command Center).
 * - Ikon tile tone semantik (opsional).
 * - Count-up angka saat mount bila `value` murni numerik.
 * - Delta chip naik/turun (opsional).
 * - Sparkline mini SVG (opsional).
 * - `href` → kartu jadi Link + hover-elevation.
 */

type StatTone = "emerald" | "blue" | "amber" | "violet" | "rose" | "teal" | "coral" | "accent";

const TONE_STYLES: Record<StatTone, string> = {
  emerald: "bg-[var(--success-bg)] text-[var(--success-fg)]",
  blue: "bg-[var(--tone-blue-bg)] text-[var(--tone-blue-fg)]",
  amber: "bg-[var(--warning-bg)] text-[var(--warning-fg)]",
  rose: "bg-[var(--destructive-bg)] text-[var(--destructive-fg)]",
  violet: "bg-[var(--tone-violet-bg)] text-[var(--tone-violet-fg)]",
  teal: "bg-[var(--tone-teal-bg)] text-[var(--tone-teal-fg)]",
  coral: "bg-[var(--tone-coral-bg)] text-[var(--tone-coral-fg)]",
  accent: "bg-[var(--role-accent-soft)] text-[var(--role-accent-strong)]",
};

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  href?: string;
  helperIcon?: ReactNode;
  /** Ikon di tile kiri. */
  icon?: ReactNode;
  /** Tone tile ikon. */
  tone?: StatTone;
  /** Delta: { value: number, suffix?: string } → chip naik/turun. */
  delta?: { value: number; suffix?: string };
  /** Deret angka sparkline (opsional). */
  sparkline?: number[];
  className?: string;
};

function useCountUp(target: number | null, duration = 600) {
  const [display, setDisplay] = useState(target ?? 0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) return;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return display;
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 72;
  const h = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      className="h-6 w-[72px] text-[var(--role-accent)]"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  helper,
  href,
  helperIcon,
  icon,
  tone = "emerald",
  delta,
  sparkline,
  className,
}: StatCardProps) {
  const numeric = /^-?\d[\d.,]*$/.test(value.trim())
    ? Number(value.replace(/[^\d-]/g, ""))
    : null;
  const counted = useCountUp(Number.isFinite(numeric) ? numeric : null);
  const displayValue = numeric !== null ? counted.toLocaleString("id-ID") : value;

  const body = (
    <div className={cn("flex flex-col gap-3 p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {icon ? (
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                TONE_STYLES[tone],
              )}
            >
              {icon}
            </span>
          ) : null}
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {label}
          </p>
        </div>
        {sparkline ? <Sparkline data={sparkline} /> : null}
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="font-heading text-2xl font-bold leading-none tracking-tight text-[var(--ink)] tabular-nums sm:text-3xl">
          {displayValue}
        </p>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
              delta.value >= 0
                ? "bg-[var(--success-bg)] text-[var(--success-fg)]"
                : "bg-[var(--destructive-bg)] text-[var(--destructive-fg)]",
            )}
          >
            {delta.value >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(delta.value)}
            {delta.suffix ?? "%"}
          </span>
        ) : null}
      </div>

      {helper ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)]">
          {helperIcon ? <span className="shrink-0">{helperIcon}</span> : null}
          {helper}
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-[var(--motion-base)] ease-out hover:-translate-y-0.5 hover:border-[var(--role-accent)] hover:shadow-[var(--shadow-card-hover)]"
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      {body}
    </div>
  );
}