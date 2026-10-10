"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import type { RecentConversation } from "@/features/doctor/services/doctorService";
import { formatRelativeTime } from "../utils/formatHelpers";

export type DoctorDashboardConsultationsProps = {
  conversations?: RecentConversation[] | null;
  isLoading?: boolean;
};

export function DoctorDashboardConsultations({
  conversations = [],
  isLoading = false,
}: DoctorDashboardConsultationsProps) {
  const items = conversations ?? [];

  return (
    <section className="bg-surface rounded-xl p-space-lg shadow-xs border border-border/50 flex flex-col gap-space-md">
      <div className="flex items-center justify-between pb-space-xs border-b border-border/30">
        <div className="flex flex-col">
          <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase">
            Ruang Periksa Online
          </span>
          <h2 className="font-headline-md text-headline-md text-ink font-bold">
            Konsultasi Pasien Terkini
          </h2>
        </div>
        <span className="font-caption text-caption px-2.5 py-1 rounded-full bg-teal-500/10 text-role-accent-doctor font-semibold">
          {items.length} Percakapan Terkini
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-space-sm">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-space-md rounded-xl bg-surface-alt animate-pulse flex flex-col gap-space-sm h-32"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-surface-container" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-32 h-4 bg-surface-container rounded" />
                  <div className="w-24 h-3 bg-surface-container rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-space-xl rounded-xl bg-surface-alt text-center flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink-subtle">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="font-headline-sm text-headline-sm text-ink font-semibold">
            Belum Ada Konsultasi Aktif
          </p>
          <p className="font-body-default text-caption text-ink-muted max-w-sm">
            Saat pasien memulai sesi konsultasi teledermatologi, riwayat percakapan akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {items.map((conv) => {
            const raw = conv as {
              uuid: string;
              user?: { full_name?: string | null } | null;
              message_count?: number | null;
              last_message?: {
                content?: string | null;
                sender_role?: string | null;
                created_at?: string | null;
              } | null;
            };

            const patientName = raw.user?.full_name ?? "Pasien";
            const initials = patientName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const isDoctorLast = raw.last_message?.sender_role === "doctor";
            const timeAgo = formatRelativeTime(raw.last_message?.created_at ?? null);

            return (
              <div
                key={raw.uuid}
                className="p-space-md rounded-xl bg-surface-alt hover:bg-surface-container-low transition-colors flex flex-col gap-space-sm border border-border/30"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-role-accent-doctor font-headline-sm text-body-default font-semibold shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-body-default text-ink font-semibold truncate">
                          {patientName}
                        </span>
                        {raw.message_count != null && (
                          <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container text-ink-muted font-medium">
                            {raw.message_count} pesan
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-ink-subtle font-caption text-caption">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeAgo || "Baru saja"}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full font-caption text-caption font-semibold shrink-0 ${
                      isDoctorLast
                        ? "bg-emerald-500/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {isDoctorLast ? "Telah Dibalas" : "Belum Dibalas"}
                  </span>
                </div>

                {raw.last_message?.content ? (
                  <p className="font-body-default text-body-default text-ink-muted italic pl-1 line-clamp-2">
                    &ldquo;{raw.last_message.content}&rdquo;
                  </p>
                ) : (
                  <p className="font-body-default text-caption text-ink-subtle italic pl-1">
                    Sesi konsultasi telah dimulai.
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border/20">
                  <span className="font-caption text-caption text-ink-subtle flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-role-accent-doctor" />
                    <span>Teledermatologi Aktif</span>
                  </span>

                  <Link
                    href={`/doctor/consultations?conversation=${raw.uuid}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-role-accent-doctor text-on-primary font-caption text-caption font-semibold shadow-xs hover:opacity-95 transition-opacity"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Buka Chat</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/doctor/consultations"
        className="inline-flex items-center justify-center gap-1 text-center font-caption text-caption text-role-accent-doctor font-semibold pt-space-xs hover:underline"
      >
        <span>Lihat Seluruh Pasien di Ruang Konsultasi</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
