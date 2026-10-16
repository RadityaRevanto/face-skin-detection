import type { DashboardCharts } from "./adminDashboardTypes";

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Label sumbu pendek "27/8" dari ISO date. */
export function chartPointLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function toLineData(series: DashboardCharts["scans_last_14_days"]) {
  return series.map((point) => ({
    label: chartPointLabel(point.date),
    value: point.count,
  }));
}

/** Persentase perubahan 7 hari terakhir vs 7 hari sebelumnya (null bila penyebut 0). */
export function weekOverWeekDelta(
  series: DashboardCharts["scans_last_14_days"],
): number | null {
  if (series.length < 14) return null;
  const prev = series.slice(0, 7).reduce((sum, p) => sum + p.count, 0);
  const curr = series.slice(7).reduce((sum, p) => sum + p.count, 0);
  if (prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}
