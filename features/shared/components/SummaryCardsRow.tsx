import { StatCard } from "@/components/ui/stat-card";

type SummaryCard = {
  label: string;
  value: string;
  helper?: string;
  href?: string;
};

type SummaryCardsRowProps = {
  cards: SummaryCard[];
  className?: string;
};

export function SummaryCardsRow({ cards, className }: SummaryCardsRowProps) {
  return (
    <section className={className ?? "grid grid-cols-1 gap-4 md:grid-cols-3"}>
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          helper={card.helper}
          href={card.href}
        />
      ))}
    </section>
  );
}
