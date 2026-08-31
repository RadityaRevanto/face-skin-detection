export function formatNumber(value: number | null): string {
  if (value == null) return "-";
  return value.toLocaleString("id-ID");
}

export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin}m lalu`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}j lalu`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}h lalu`;
  } catch {
    return "";
  }
}
