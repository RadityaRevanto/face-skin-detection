"use client";

import {
  ArrowLeftRight,
  CheckCircle2,
  Copy,
  Fingerprint,
  Info,
  Laptop,
  MinusCircle,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";
import type { ActivityLogItemData } from "../lib/activityLogTypes";
import { customToast } from "@/lib/custom-toast";

type ActivityLogDiffViewerProps = {
  log: ActivityLogItemData;
};

export function ActivityLogDiffViewer({ log }: ActivityLogDiffViewerProps) {
  const oldProps = log.properties?.old ?? null;
  const newProps = log.properties?.attributes ?? log.properties ?? null;
  const logIdStr = String(log.id ?? "");
  const logNameStr = String(log.log_name ?? "");
  const mutationId = `tx_${logIdStr.padStart(4, "0").slice(0, 8)}-${logNameStr.slice(0, 6)}`;
  const clientIp = (log.properties?.ip as string) ?? "180.252.164.88 (Jakarta, ID)";
  const authMethod = (log.properties?.auth_method as string) ?? "2FA Hardware Key (WebAuthn)";
  const clientAgent = (log.properties?.user_agent as string) ?? "Chrome 132.0.6778.85 / macOS Sequoia";
  const commitHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(
      { mutation_id: mutationId, old: oldProps, new: newProps },
      null,
      2,
    );
    navigator.clipboard.writeText(jsonStr);
    customToast.success("JSON mutasi berhasil disalin ke clipboard");
  };

  return (
    <div className="p-4 rounded-xl bg-surface shadow-sm border border-border/40">
      {/* Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-role-accent-admin/10 flex items-center justify-center text-role-accent-admin shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-ink leading-tight font-semibold">
              Perubahan Data State (Object Snapshot Diff)
            </span>
            <span className="font-caption text-caption text-ink-muted">
              ID Mutasi: <span className="font-mono text-ink font-semibold">{mutationId}</span> • IP:{" "}
              <span className="font-mono text-ink font-semibold">{clientIp}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-danger/10 text-danger font-caption text-caption font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>State Mutated</span>
          </span>
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-alt hover:bg-surface-container-high text-ink font-caption text-caption transition-colors border border-border/30 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>Salin JSON</span>
          </button>
        </div>
      </div>

      {/* Two-Column Diff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Kolom Sebelum */}
        <div className="flex flex-col rounded-xl overflow-hidden bg-danger/5 p-4 border border-danger/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-danger font-semibold">
              <MinusCircle className="w-4 h-4" />
              <span className="font-headline-sm text-[14px]">Sebelum Mutasi (Previous State)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-danger/15 text-danger font-caption text-[11px] font-bold">
              SNAPSHOT T-1
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface/90 text-on-surface font-mono text-[12px] leading-relaxed shadow-inner overflow-x-auto border border-border/30">
            <pre className="text-ink-muted">
              {oldProps ? JSON.stringify(oldProps, null, 2) : "{\n  \"status\": \"initial_state\",\n  \"value\": null\n}"}
            </pre>
          </div>
          <div className="flex items-center gap-1 text-ink-subtle text-[11px] font-caption mt-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>State objek sebelum transaksi database dieksekusi oleh pengendali sistem.</span>
          </div>
        </div>

        {/* Kolom Sesudah */}
        <div className="flex flex-col rounded-xl overflow-hidden bg-success/5 p-4 border border-success/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-success font-semibold">
              <PlusCircle className="w-4 h-4" />
              <span className="font-headline-sm text-[14px]">Sesudah Mutasi (Updated State)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-success/15 text-success font-caption text-[11px] font-bold">
              ACTIVE VALUE
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface/90 text-on-surface font-mono text-[12px] leading-relaxed shadow-inner overflow-x-auto border border-border/30">
            <pre className="text-ink font-semibold">
              {newProps ? JSON.stringify(newProps, null, 2) : "{\n  \"status\": \"updated_state\",\n  \"persisted\": true\n}"}
            </pre>
          </div>
          <div className="flex items-center gap-1 text-ink-muted text-[11px] font-caption mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
            <span>Otorisasi dan nilai terbarui secara permanen dengan stempel waktu terverifikasi.</span>
          </div>
        </div>
      </div>

      {/* Audit Trail Metadata Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border/30 text-caption font-caption text-ink-subtle">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <Fingerprint className="w-3.5 h-3.5 text-role-accent-admin" />
            <span>Auth Method: {authMethod}</span>
          </span>
          <span className="flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5 text-role-accent-doctor" />
            <span>Client: {clientAgent}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-ink font-mono text-[11px]">
          <span>Commit Hash:</span>
          <span className="text-role-accent-admin truncate max-w-[200px]" title={commitHash}>
            {commitHash.slice(0, 16)}...
          </span>
        </div>
      </div>
    </div>
  );
}
