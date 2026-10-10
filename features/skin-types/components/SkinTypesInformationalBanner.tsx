import { Sparkles, Droplets, FileText, ShieldCheck } from "lucide-react";

type SkinTypesInformationalBannerProps = {
  totalCount: number;
};

export function SkinTypesInformationalBanner({
  totalCount,
}: SkinTypesInformationalBannerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1 */}
      <div className="bg-surface rounded-2xl p-4 shadow-xs border border-border/50 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-role-accent-doctor shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-caption text-caption text-ink-subtle">
            Klasifikasi Paten
          </div>
          <div className="font-headline-sm text-caption text-ink font-bold truncate">
            {totalCount} Standar Primer
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-surface rounded-2xl p-4 shadow-xs border border-border/50 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-role-accent-doctor shrink-0">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-caption text-caption text-ink-subtle">
            Tingkat Sebum &amp; NMF
          </div>
          <div className="font-headline-sm text-caption text-ink font-bold truncate">
            Terkalibrasi Skala 1-5
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-surface rounded-2xl p-4 shadow-xs border border-border/50 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-info shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-caption text-caption text-ink-subtle">
            Aturan Terhubung
          </div>
          <div className="font-headline-sm text-caption text-ink font-bold truncate">
            Formulasi Aktif
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-surface rounded-2xl p-4 shadow-xs border border-border/50 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-success shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-caption text-caption text-ink-subtle">
            Integritas Dermis
          </div>
          <div className="font-headline-sm text-caption text-ink font-bold truncate">
            Validasi Konsisten 100%
          </div>
        </div>
      </div>
    </div>
  );
}
