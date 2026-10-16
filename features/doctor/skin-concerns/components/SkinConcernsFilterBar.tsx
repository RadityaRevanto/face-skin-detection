import { Search, RotateCcw } from "lucide-react";

type SkinConcernsFilterBarProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
};

export function SkinConcernsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
}: SkinConcernsFilterBarProps) {
  return (
    <section className="bg-surface rounded-2xl p-4 shadow-xs border border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto flex-1 max-w-2xl">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari masalah kulit atau label deteksi..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-alt text-ink font-body-default text-body-default placeholder:text-ink-subtle border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Deteksi</option>
            <option value="inactive">Nonaktif / Evaluasi</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink font-headline-sm text-caption font-semibold transition-all border border-border/40 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>
    </section>
  );
}
