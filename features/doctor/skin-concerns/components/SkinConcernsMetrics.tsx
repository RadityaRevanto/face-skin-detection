import { Sparkles, CheckCircle2, Crosshair, Cpu } from "lucide-react";

type SkinConcernsMetricsProps = {
  totalCount: number;
  activeCount: number;
};

export function SkinConcernsMetrics({
  totalCount,
  activeCount,
}: SkinConcernsMetricsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="bg-surface rounded-2xl p-5 shadow-xs border border-border/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-role-accent-doctor shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Total Concern
          </span>
          <span className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight">
            {totalCount} Entitas
          </span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-surface rounded-2xl p-5 shadow-xs border border-border/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-success shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Status Validasi
          </span>
          <span className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight">
            {activeCount} Aktif
          </span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-surface rounded-2xl p-5 shadow-xs border border-border/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-info shrink-0">
          <Crosshair className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Rata-rata mAP@50
          </span>
          <span className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight">
            94.8%
          </span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-surface rounded-2xl p-5 shadow-xs border border-border/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-role-accent-doctor shrink-0">
          <Cpu className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Versi Model Saat Ini
          </span>
          <span className="font-headline-lg text-headline-lg text-ink font-bold tracking-tight">
            v3.4-prod
          </span>
        </div>
      </div>
    </section>
  );
}
