"use client";

import { Bell, CheckCheck, RefreshCw } from "lucide-react";

type AdminNotificationsHeaderProps = {
  total: number;
  unreadCount: number;
  isLoading: boolean;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
};

export function AdminNotificationsHeader({
  total,
  unreadCount,
  isLoading,
  onMarkAllAsRead,
  onRefresh,
}: AdminNotificationsHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Page Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-eyebrow text-eyebrow text-role-accent-admin uppercase tracking-wider font-semibold">
              PUSAT PERINGATAN SISTEM
            </span>
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            Notifikasi Sistem
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1 max-w-2xl">
            Pantau seluruh pembaruan verifikasi tenaga medis, peringatan keamanan, mutasi akun, dan aktivitas platform SkinCek secara terpadu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-alt shadow-sm text-ink-muted hover:text-ink transition-colors font-caption text-caption font-semibold border border-border/40 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0 || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-role-accent-admin text-surface hover:bg-secondary-container shadow-sm transition-all font-caption text-caption font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>
      </div>

      {/* 2. Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total Notifikasi */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Total Notifikasi
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {total} Pesan
            </span>
            <span className="font-caption text-caption text-ink-muted mt-1">
              Semua arsip tercatat
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-role-accent-admin/10 flex items-center justify-center text-role-accent-admin">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Belum Dibaca */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Belum Ditinjau
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {unreadCount} Pesan
            </span>
            <span className="font-caption text-caption text-warning mt-1 font-medium">
              {unreadCount > 0 ? "Memerlukan perhatian" : "Semua sudah dibaca"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <span className="font-headline-sm font-bold">{unreadCount}</span>
          </div>
        </div>

        {/* KPI 3: Status Integritas */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Koneksi Notifikasi
            </span>
            <span className="font-headline-lg text-headline-lg text-success font-semibold mt-0.5">
              Sinkron Aktif
            </span>
            <span className="font-caption text-caption text-ink-muted mt-1">
              Event bus & WebSocket live
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <CheckCheck className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
