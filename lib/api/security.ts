export type LoginActivity = {
  uuid: string; // Token ID
  device: string; // Device/Browser name
  ip_address: string | null;
  location?: any;
  last_used_at: string | null;
  created_at: string;
  is_current: boolean;
};

export async function getLoginActivity(): Promise<LoginActivity[]> {
  const res = await fetch("/api/login-activity", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal mengambil daftar aktivitas login");
  }

  return json.data || [];
}

export async function revokeSession(tokenId: string): Promise<void> {
  const res = await fetch(`/api/login-activity/${tokenId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal mencabut akses sesi");
  }
}

export async function revokeAllOtherSessions(): Promise<void> {
  const res = await fetch("/api/auth/logout-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal mencabut semua sesi lainnya");
  }
}
