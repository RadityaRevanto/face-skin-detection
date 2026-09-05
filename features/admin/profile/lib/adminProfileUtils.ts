export function formatAdminProfileDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(dateStr));
  } catch {
    return "-";
  }
}

export function formatUserAgent(userAgent: string | null): string {
  if (!userAgent) return "-";

  // Ambil segmen browser utama dari user agent agar mudah dibaca.
  const match = userAgent.match(/\((.*?)\)/);
  if (match) {
    const segments = match[1].split(";").map((s) => s.trim());
    const os = segments[0] ?? "";
    const browser =
      userAgent.includes("Edg")
        ? "Edge"
        : userAgent.includes("Chrome")
          ? "Chrome"
          : userAgent.includes("Firefox")
            ? "Firefox"
            : userAgent.includes("Safari")
              ? "Safari"
              : "";
    return browser ? `${browser} -+ ${os}` : os || userAgent;
  }

  return userAgent;
}
