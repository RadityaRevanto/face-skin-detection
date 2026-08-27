export type ScanHistory = {
  uuid: string;
  scan_mode: "upload" | "livecam";
  predicted_class: string;
  confidence: number;
  severity_level: "low" | "medium" | "high";
  severity_score: number;
  image_url: string;
  created_at: string;
};

export async function getScans(page: number = 1) {
  const res = await fetch(`/api/scans?page=${page}&sort=-created_at`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil riwayat scan");
  }

  return res.json();
}

export async function submitScanFeedback(id: string, isAccurate: boolean) {
  const res = await fetch(`/api/scans/${id}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_accurate: isAccurate }),
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {});
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengirim ulasan");
  }

  return res.json();
}
