"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type ChartPoint = { label: string; value: number };

type LineChartProps = {
  data: ChartPoint[];
  /** Tinggi area plot (px). */
  height?: number;
  /** Warna garis; default role accent. */
  color?: string;
  /** Format label sumbu Y / tooltip. */
  formatValue?: (v: number) => string;
  title?: string;
  className?: string;
};

/**
 * Line/area chart SVG ringan (tanpa dependency).
 * - Animasi draw via stroke-dashoffset (respect reduced-motion).
 * - Hover titik → tooltip; keyboard: focus titik menampilkan nilai (a11y).
 * - Fallback tabel tersembunyi untuk screen reader.
 */
export function LineChart({
  data,
  height = 180,
  color = "var(--role-accent)",
  formatValue = (v) => String(v),
  title = "Grafik tren",
  className,
}: LineChartProps) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(1));
    return () => cancelAnimationFrame(id);
  }, []);

  if (data.length < 2) {
    return (
      <div className="grid h-40 place-items-center text-sm text-slate-400">
        Data belum cukup untuk menampilkan tren.
      </div>
    );
  }

  const w = 640;
  const h = height;
  const padX = 8;
  const padY = 16;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = 0;
  const range = max - min || 1;

  const coords = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (d.value - min) / range) * (h - padY * 2);
    return { x, y, ...d };
  });

  const linePts = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPts = `${padX},${h - padY} ${linePts} ${w - padX},${h - padY}`;
  const totalLen = w * 2;

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label={title}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={padX}
            x2={w - padX}
            y1={padY + g * (h - padY * 2)}
            y2={padY + g * (h - padY * 2)}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        <polygon points={areaPts} fill="url(#lineArea)" opacity={progress} />
        <polyline
          points={linePts}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: totalLen,
            strokeDashoffset: totalLen * (1 - progress),
            transition: "stroke-dashoffset var(--motion-slow) var(--ease-out-soft)",
          }}
        />

        {coords.map((c, i) => (
          <g key={i}>
            {active === i ? (
              <line
                x1={c.x}
                x2={c.x}
                y1={padY}
                y2={h - padY}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            ) : null}
            <circle
              cx={c.x}
              cy={c.y}
              r={active === i ? 5 : 3}
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="cursor-pointer outline-none"
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
            {active === i ? (
              <text
                x={Math.min(Math.max(c.x, 40), w - 40)}
                y={Math.max(c.y - 10, 14)}
                textAnchor="middle"
                className="fill-slate-700 text-[11px] font-semibold"
              >
                {formatValue(c.value)}
              </text>
            ) : null}
          </g>
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>{coords[0]?.label}</span>
        <span>{coords[coords.length - 1]?.label}</span>
      </div>

      {/* Fallback tabel untuk screen reader */}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Tanggal</th>
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