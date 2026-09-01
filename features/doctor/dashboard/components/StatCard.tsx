import Link from "next/link";

const ACCENT_MAP: Record<string, { bg: string; text: string; iconBg: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100 text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   iconBg: "bg-amber-100 text-amber-600" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     iconBg: "bg-sky-100 text-sky-600" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  iconBg: "bg-violet-100 text-violet-600" },
  yellow:  { bg: "bg-yellow-50",  text: "text-yellow-700",  iconBg: "bg-yellow-100 text-yellow-600" },
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  accent?: string;
  icon: React.ReactNode;
  href?: string;
};

export function StatCard({ title, value, subtitle, accent = "emerald", icon, href }: StatCardProps) {
  const colors = ACCENT_MAP[accent] ?? ACCENT_MAP.emerald;
  const content = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className={`mt-2 text-2xl font-bold ${colors.text}`}>{value}</p>
        {subtitle && <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${colors.iconBg}`}>{icon}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer">
        {content}
      </Link>
    );
  }

  return <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">{content}</div>;
}
