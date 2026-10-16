"use client";

import { useState } from "react";
import { ChevronDown, Shield, Sliders } from "lucide-react";
import type { ActivityLogItemData } from "../lib/activityLogTypes";
import { ActivityLogDiffViewer } from "./ActivityLogDiffViewer";

type ActivityLogRowProps = {
  log: ActivityLogItemData;
  defaultExpanded?: boolean;
};

export function ActivityLogRow({
  log,
  defaultExpanded = false,
}: ActivityLogRowProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const causer = log.causer;
  const causerName = causer?.full_name ?? "Sistem SkinCek";
  const causerEmail = causer?.email ?? "system@skincek.id";
  const causerRole = causer?.role ?? "SUPER";
  const initials = causerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(log.created_at || Date.now()));

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(log.created_at || Date.now()));

  const logTypeBadgeColor = () => {
    switch (log.log_name) {
      case "doctor_verification":
        return "bg-role-accent-doctor/10 text-role-accent-doctor";
      case "authentication":
        return "bg-info/10 text-info";
      case "system_config":
        return "bg-warning/10 text-warning";
      default:
        return "bg-role-accent-admin/10 text-role-accent-admin";
    }
  };

  const subjectType = log.subject_type?.replace(/.*\\/, "") ?? "User";
  const subjectId = log.subject_id ? `#${log.subject_id}` : "#SYS-01";
  const subjectName = log.subject_name ?? "Entitas Terkait";

  return (
    <div className="flex flex-col transition-colors border-b border-border/30 last:border-b-0">
      {/* Row Bar */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className={`grid grid-cols-12 px-6 py-4 items-center gap-y-2 cursor-pointer transition-colors ${
          isExpanded ? "bg-surface-container-low/40" : "hover:bg-surface-alt/60"
        }`}
      >
        {/* Pelaku */}
        <div className="col-span-3 flex items-center gap-3 min-w-0 pr-2">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-role-accent-admin/15 text-role-accent-admin flex items-center justify-center font-headline-sm text-headline-sm font-semibold">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success flex items-center justify-center ring-2 ring-surface">
              <Shield className="w-2.5 h-2.5 text-surface" />
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body-default text-body-default text-ink font-semibold truncate flex items-center gap-1.5">
              {causerName}
              <span className="px-1.5 py-0.5 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-caption text-[10px] font-bold uppercase">
                {causerRole}
              </span>
            </span>
            <span className="font-caption text-caption text-ink-subtle truncate">
              {causerEmail}
            </span>
          </div>
        </div>

        {/* Jenis Log */}
        <div className="col-span-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-caption text-caption font-semibold ${logTypeBadgeColor()}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {log.log_name}
          </span>
        </div>

        {/* Deskripsi Aksi */}
        <div className="col-span-3 pr-4">
          <span className="font-body-default text-body-default text-ink font-medium block">
            {log.description}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 text-ink-subtle font-caption text-[12px]">
            <Sliders className="w-3 h-3" />
            <span>Metadata & reason diff recorded</span>
          </div>
        </div>

        {/* Target */}
        <div className="col-span-2 flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-surface-alt text-ink font-caption text-caption font-bold">
              {subjectType}
            </span>
            <span className="font-caption text-caption text-ink-muted">
              {subjectId}
            </span>
          </div>
          <span className="font-caption text-caption text-ink font-semibold truncate mt-0.5">
            {subjectName}
          </span>
        </div>

        {/* Waktu & Chevron */}
        <div className="col-span-2 flex items-center justify-end gap-3 text-right">
          <div className="flex flex-col">
            <span className="font-body-default text-body-default text-ink font-semibold">
              {formattedDate}
            </span>
            <span className="font-caption text-caption text-ink-subtle">
              {formattedTime} WIB
            </span>
          </div>
          <div
            className={`w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-role-accent-admin shadow-sm transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Accordion Drawer */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-1 bg-surface-container-low/20 animate-in fade-in duration-200">
          <ActivityLogDiffViewer log={log} />
        </div>
      )}
    </div>
  );
}
