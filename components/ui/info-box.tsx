import { cn } from "@/lib/utils";

type InfoBoxProps = {
  label: string;
  value: string;
  className?: string;
};

export function InfoBox({ label, value, className = "" }: InfoBoxProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5",
        className,
      )}
    >
      <p className="mb-1 text-xs text-[var(--ink-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}