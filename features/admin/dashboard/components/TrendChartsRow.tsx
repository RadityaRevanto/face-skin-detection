"use client";

import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/charts/LineChart";
import type { ChartPoint } from "@/components/ui/charts/LineChart";

type TrendChartsRowProps = {
  scans: ChartPoint[];
  registrations: ChartPoint[];
};

/** Baris chart tren 14 hari — data dari GET /admin/dashboard. */
export function TrendChartsRow({ scans, registrations }: TrendChartsRowProps) {
  const cards = [
    { title: "Scan per Hari", data: scans, aria: "Tren scan 14 hari terakhir" },
    {
      title: "Registrasi User",
      data: registrations,
      aria: "Tren registrasi user 14 hari terakhir",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-5">
      {cards.map((card) => (
        <Card key={card.title} className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-[var(--ink)]">
                {card.title}
              </h2>
              <p className="text-xs text-[var(--ink-muted)]">14 hari terakhir</p>
            </div>
            <span className="rounded-full bg-[var(--role-accent-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--role-accent-strong)] tabular-nums">
              {card.data.reduce((sum, p) => sum + p.value, 0).toLocaleString("id-ID")} total
            </span>
          </div>
          <LineChart data={card.data} title={card.aria} />
        </Card>
      ))}
    </section>
  );
}