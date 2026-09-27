"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type BarDatum = { label: string; value: number };

type BarChartProps = {
  data: BarDatum[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
  title?: string;
  className?: string;
};

/**
 * Bar chart SVG ringan. Animasi tinggi bar saat mount,
 * tooltip hover + a11y fallback tabel.
 */
export function BarChart({
  data,
  height = 180,
  color = "var(--role-accent)",
  formatValue = (v) => String(v),
  title = "Grafik batang",
  className,
}: BarChartProps) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  if (data.length === 0) {
    return (
      <div className="grid h-40 place-items-center text-sm text-slate-400">
        Belum ada data.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${data.length * 36} ${height}`}
        className="w-full"
        role="img"
        aria-label={title}
        preserveAspectRatio="none"
      >
        <g>
          {data.map((d, i) => {
            const h = (d.value / max) * (height - 36);
            const x = i * 36 + 8;
            const y = height - 24 - h;
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={ready ? y : height - 24}
                  width={20}
                  height={ready ? h : 0}
                  rx="4"
                  fill={color}
                  fillOpacity={active === i ? 1 : 0.82}
                  className="cursor-pointer outline-none"
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  style={{
                    transition: "height var(--motion-slow) var(--ease-out-soft), fill-opacity var(--motion-fast) ease-out",
                  }}
                />
                <text
                  x={x + 10}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-medium"
                >
                  {d.label}
                </text>
                {active === i ? (
                  <text
                    x={x + 10}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-slate-700 text-[10px] font-bold"
                  >
                    {formatValue(d.value)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{formatValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}