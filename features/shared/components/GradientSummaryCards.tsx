import { GradientStatCard } from "@/components/ui/gradient-stat-card";

/**
 * Baris summary cards fe-simkatmawa-style: label + angka besar +
 * helper, gradient penuh + watermark ikon putih/15.
 */

type GradientSummaryCardsProps = {
  cards: {
    label: string;
    value: string;
    helper: string;
    /** Watermark ikon SVG (dirender 88px putih/15). */
    icon: React.ReactNode;
    variant?: "navy" | "emerald" | "amber" | "rose" | "sky" | "violet";
    href?: string;
  }[];
  className?: string;
};

export function GradientSummaryCards({ cards, className }: GradientSummaryCardsProps) {
  return (
    <section className={className ?? "grid grid-cols-1 gap-4 md:grid-cols-3"}>
      {cards.map((card) => (
        <GradientStatCard
          key={card.label}
          label={card.label}
          value={card.value}
          variant={card.variant ?? "navy"}
          helper={card.helper}
          icon={<span className="block [&_svg]:h-[88px] [&_svg]:w-[88px]">{card.icon}</span>}
        />
      ))}
    </section>
  );
}
