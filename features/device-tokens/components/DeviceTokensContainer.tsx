"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, Smartphone, AlertCircle } from "lucide-react";
import type { DeviceToken } from "../types";
import { deviceTokenService } from "@/features/profile/services/deviceTokenService";

export function DeviceTokensContainer() {
  const [tokens, setTokens] = useState<DeviceToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await deviceTokenService.list();
      setTokens(response.data as unknown as DeviceToken[]);
      setErrorMsg(null);
    } catch {
      setErrorMsg("Gagal memuat daftar device.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, setState di dalam async callback
    fetchTokens();
  }, [fetchTokens]);

  async function handleDelete(uuid: string) {
    if (!confirm("Yakin ingin menghapus device token ini?")) return;
    setDeletingId(uuid);
    try {
      await deviceTokenService.destroy(uuid);
      fetchTokens();
    } catch {
      alert("Gagal menghapus device token");
    } finally {
      setDeletingId(null);
    }
  }

  const platformIcon = (platform: string) =>
    platform.toLowerCase() === "web"
      ? Globe
      : Smartphone;

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="flex items-center gap-2">
            <AlertCircle className="shrink-0" size={18} />
            {errorMsg}
          </span>
          <button
            type="button"
            onClick={fetchTokens}
            className="shrink-0 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-200"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : tokens.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {tokens.map((token) => {
              const Icon = platformIcon(token.platform);
              return (
                <div
                  key={token.uuid}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="shrink-0 text-slate-400" size={22} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Perangkat {token.platform}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {token.fcm_token.slice(0, 20)}...
                      </p>
                      <p className="text-xs text-slate-400">
                        Ditambahkan:{" "}
                        {token.created_at
                          ? new Date(token.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(token.uuid)}
                    disabled={deletingId === token.uuid}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deletingId === token.uuid ? "..." : "Hapus"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Belum ada device terdaftar
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Device akan otomatis terdaftar saat mengaktifkan notifikasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
