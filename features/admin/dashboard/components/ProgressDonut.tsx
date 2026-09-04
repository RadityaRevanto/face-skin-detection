import { cn } from "@/lib/utils";

/**
 * ProgressDonut (DESIGN.md §4.6) — pola Dasher "Task Progress".
 *
 * SVG ring komposisi status (pending/approved/rejected) dengan persentase
 * besar di tengah + 3 mini card di bawah. Warna token: emerald-500,
 * amber-500, rose-500 di atas track slate-100.
 *
 * Mobile: ring tengah w-40, mini card grid 3 kolom kompak text-sm.
 */

type Segment = {
  label: string;
  value: number;
  color: string;
  /** Kelas teks mini card. */
  textClass: string;
};

type ProgressDonutProps = {
  /** Judul ring tengah (angka utama, mis. "64%"). */
  centerValue: string;
  /** Label kecil di bawah angka tengah (mis. "approved"). */
  centerLabel: string;
  pending: number;
  approved: number;
  rejected: number;
  className?: string;
};

const SIZE = 160;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressDonut({
  centerValue,
  centerLabel,
  pending,
  approved,
  rejected,
  className,
}: ProgressDonutProps) {
  const total = pending + approved + rejected;

  const segments: Segment[] = [
    { label: "Approved", value: approved, color: "#10b981", textClass: "text-emerald-600" },
    { label: "Pending", value: pending, color: "#f59e0b", textClass: "text-amber-600" },
    { label: "Rejected", value: rejected, color: "#f43f5e", textClass: "text-rose-600" },
  ];

  let offsetAccumulated = 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-center">
        <div className="relative w-40">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`Komposisi verifikasi: ${approved} approved, ${pending} pending, ${rejected} rejected`}
          >
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={STROKE}
            />

            {/* Segmen proporsional (statis — murni visual dari angka existing) */}
            {total > 0 &&
              segments.map((segment) => {
                const fraction = segment.value / total;
                const dash = fraction * CIRCUMFERENCE;
                const offset = offsetAccumulated;
                offsetAccumulated += dash;

                if (segment.value === 0) return null;

                return (
                  <circle
                    key={segment.label}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                  />
                );
              })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {centerValue}
            </span>
            <span className="mt-0.5 text-xs text-slate-500">{centerLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center sm:gap-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="rounded-xl bg-slate-50 px-2 py-3"
          >
            <p className={cn("text-lg font-bold leading-none sm:text-xl", segment.textClass)}>
              {segment.value}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {segment.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
