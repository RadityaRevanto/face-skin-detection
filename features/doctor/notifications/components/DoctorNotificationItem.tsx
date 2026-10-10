"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Stethoscope,
  Trash2,
  UserCheck,
} from "lucide-react";
import type { NotificationData } from "@/features/notification/lib/NotificationTypes";
import { getCategoryBadge } from "@/features/notification/lib/notificationToast";

type DoctorNotificationItemProps = {
  notif: NotificationData;
  formatTime: (dateStr: string) => string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

function getNotificationIcon(category: string, type: string) {
  if (category.startsWith("consultation") || category.startsWith("message") || category.startsWith("chat")) {
    return <MessageSquare className="w-5 h-5 text-role-accent-doctor" />;
  }
  if (category.startsWith("verification")) {
    return <UserCheck className="w-5 h-5 text-role-accent-doctor" />;
  }
  if (category.startsWith("clinical") || category.startsWith("prescription")) {
    return <Stethoscope className="w-5 h-5 text-role-accent-doctor" />;
  }
  if (type === "error" || category === "logout") {
    return <ShieldAlert className="w-5 h-5 text-error" />;
  }
  if (type === "success") {
    return <CheckCircle2 className="w-5 h-5 text-success" />;
  }
  if (type === "warning") {
    return <ShieldAlert className="w-5 h-5 text-warning" />;
  }
  return <Bell className="w-5 h-5 text-role-accent-doctor" />;
}

function resolveDoctorActionLink(category: string, actionUrl: string | null): string | null {
  if (category.startsWith("consultation") || category.startsWith("chat") || category.startsWith("message")) {
    return "/doctor/consultations";
  }
  if (category.startsWith("verification")) {
    return "/doctor/profile";
  }
  if (actionUrl && actionUrl.startsWith("/doctor")) {
    return actionUrl;
  }
  return null;
}

export function DoctorNotificationItem({
  notif,
  formatTime,
  onMarkAsRead,
  onDelete,
}: DoctorNotificationItemProps) {
  const isRead = notif.is_read;
  const categoryBadge = getCategoryBadge(notif.category);
  const doctorHref = resolveDoctorActionLink(notif.category, notif.action_url);

  return (
    <div
      className={`group relative flex items-start gap-4 p-5 transition-colors ${
        isRead ? "bg-surface hover:bg-surface-alt/70" : "bg-role-accent-doctor/[0.03] hover:bg-role-accent-doctor/[0.06]"
      }`}
    >
      {/* Unread Accent Pillar */}
      {!isRead && (
        <span
          className="absolute left-0 top-0 bottom-0 w-1 bg-role-accent-doctor rounded-r"
          aria-hidden="true"
        />
      )}

      {/* Category Icon Container */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
          isRead
            ? "bg-surface-alt border-border/60 text-ink-muted"
            : "bg-surface border-role-accent-doctor/30 text-role-accent-doctor shadow-sm"
        }`}
      >
        {getNotificationIcon(notif.category, notif.type)}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full font-caption text-[11px] font-semibold ${categoryBadge.className}`}
            >
              {categoryBadge.label}
            </span>
            <h2
              className={`font-headline-sm text-headline-sm truncate ${
                isRead ? "text-ink font-medium" : "text-ink font-bold"
              }`}
            >
              {notif.title || "Notifikasi Klinis"}
            </h2>
          </div>

          <span className="font-caption text-caption text-ink-subtle shrink-0 whitespace-nowrap">
            {formatTime(notif.created_at)}
          </span>
        </div>

        <p className="font-body-default text-body-default text-ink-muted leading-relaxed line-clamp-2">
          {notif.message}
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/30">
          {doctorHref && (
            <Link
              href={doctorHref}
              className="inline-flex items-center gap-1.5 font-caption text-caption font-semibold text-role-accent-doctor hover:opacity-80 transition-colors py-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Terkait</span>
            </Link>
          )}

          {!isRead && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notif.id)}
              className="inline-flex items-center gap-1 font-caption text-caption font-semibold text-role-accent-doctor hover:opacity-80 transition-colors py-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tandai Dibaca</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notif.id)}
            className="inline-flex items-center gap-1 font-caption text-caption font-semibold text-error hover:text-error/80 transition-colors py-1 ml-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
