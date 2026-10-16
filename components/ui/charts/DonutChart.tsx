"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
  textClass?: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  stroke?: number;
  className?: string;
};

/**
 * Donut chart SVG dengan animasi segmen saat mount.
 * Track netral + segmen proporsional; mini-card ringkasan opsional via pemanggil.
 */
export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 160,
  stroke = 14,
  className,
}: DonutChartProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(1));
    return () => cancelAnimationFrame(id);
  }, []);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let offset = 0;

  return (
    <div className={cn("relative", className)} style={{ width: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`${centerLabel}: ${centerValue}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        {total > 0 &&
          segments.map((segment) => {
            if (segment.value === 0) return null;
            const fraction = (segment.value / total) * progress;
            const dash = fraction * circumference;
            const strokeOffset = -offset;
            offset += (segment.value / total) * circumference;
            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="butt"
                style={{
                  transition: "stroke-dasharray var(--motion-slow) var(--ease-out-soft)",
                }}
              />
            );
          })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
          {centerValue}
        </span>
        <span className="mt-0.5 text-xs text-slate-500">{centerLabel}</span>
      </div>
    </div>
  );
}