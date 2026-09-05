import {
  GradientStatCard,
  type GradientStatVariant,
} from "@/components/ui/gradient-stat-card";

/** Pemetaan accent lama → varian gradient fe-simkatmawa. */
const ACCENT_TO_VARIANT: Record<string, GradientStatVariant> = {
  emerald: "emerald",
  amber: "amber",
  sky: "sky",
  violet: "violet",
  yellow: "amber",
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
  const variant = ACCENT_TO_VARIANT[accent] ?? "emerald";

  return (
    <GradientStatCard
      label={title}
      value={value}
      variant={variant}
      href={href}
      helper={subtitle}
      icon={<span className="block [&_svg]:h-[88px] [&_svg]:w-[88px]">{icon}</span>}
    />
  );
}
