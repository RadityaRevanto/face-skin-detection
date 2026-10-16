import { Cpu, BookOpen } from "lucide-react";

type SkinConcernsHeaderProps = {
  totalCount: number;
};

export function SkinConcernsHeader({ totalCount }: SkinConcernsHeaderProps) {
  return (
    <section className="bg-surface rounded-2xl shadow-xs border border-border/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1 max-w-2xl">
        <span className="font-eyebrow text-eyebrow text-role-accent-doctor uppercase tracking-wider font-bold">
          Basis Pengetahuan Model AI
        </span>
        <h1 className="font-display text-display text-ink font-bold tracking-tight">
          Daftar Skin Concern
        </h1>
        <p className="font-body-default text-body-default text-ink-muted leading-relaxed">
          Katalog referensi patologi kulit dan klasifikasi kelas deteksi model Machine Learning SkinCek.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl text-role-accent-doctor border border-border/40">
          <Cpu className="w-4 h-4 text-role-accent-doctor" />
          <span className="font-caption text-caption font-semibold">
            {totalCount} Kelas Terlatih (YOLOv8 + ViT)
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            window.open("https://github.com/ultralytics/ultralytics", "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center gap-1.5 bg-role-accent-doctor hover:opacity-95 text-on-primary px-4 py-2 rounded-xl font-headline-sm text-caption font-semibold transition-all shadow-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Dokumentasi AI</span>
        </button>
      </div>
    </section>
  );
}
