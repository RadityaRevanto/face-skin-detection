"use client";

import { useState, useEffect, useCallback } from "react";
import type { DeviceToken } from "../types";
import { getDeviceTokens, deleteDeviceToken } from "../lib/deviceTokensService";

export function DeviceTokensContainer() {
  const [tokens, setTokens] = useState<DeviceToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getDeviceTokens();
      setTokens(data);
    } catch (error) {
      console.error("Failed to fetch device tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  async function handleDelete(uuid: string) {
    if (!confirm("Yakin ingin menghapus device token ini?")) return;
    setDeletingId(uuid);
    try {
      await deleteDeviceToken(uuid);
      fetchTokens();
    } catch {
      alert("Gagal menghapus device token");
    } finally {
      setDeletingId(null);
    }
  }

  function getPlatformIcon(platform: string) {
    switch (platform.toLowerCase()) {
      case "ios":
        return "📱";
      case "android":
        return "🤖";
      case "web":
        return "🌐";
      default:
        return "📲";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Device Tokens
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola device yang menerima notifikasi push
        </p>
      </div>

      {/* Token List */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : tokens.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {tokens.map((token) => (
              <div
                key={token.uuid}
                className="flex items-center justify-between p-4 hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getPlatformIcon(token.platform)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Perangkat {token.platform}
                    </p>
                    <p className="text-xs text-slate-500">
                      {token.platform} • {token.fcm_token.slice(0, 20)}...
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
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                >
                  {deletingId === token.uuid ? "..." : "Hapus"}
                </button>
              </div>
            ))}
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
