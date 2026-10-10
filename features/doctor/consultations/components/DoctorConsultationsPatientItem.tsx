"use client";

import type { Conversation } from "@/lib/api/consultations-query";
import { formatTime } from "@/features/consultation/utils/consultationHelpers";
import { formatGender } from "@/lib/utils/demographics";
import { Image as ImageIcon, Sparkles } from "lucide-react";

type DoctorConsultationsPatientItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conv: Conversation) => void;
};

export function DoctorConsultationsPatientItem({
  conversation,
  isActive,
  onSelect,
}: DoctorConsultationsPatientItemProps) {
  const patient = conversation.user;
  const lastMsg = conversation.last_message;
  const isAwaitingReply = !lastMsg || lastMsg.sender?.role === "user";

  const renderMessagePreview = () => {
    if (!lastMsg) return "Menunggu pesan pertama pasien";
    if (lastMsg.type === "image") {
      return (
        <span className="inline-flex items-center gap-1 text-ink-muted">
          <ImageIcon className="w-3.5 h-3.5 text-ink-subtle" />
          <span>Mengirim foto keluhan kulit</span>
        </span>
      );
    }
    if (lastMsg.type === "scan_result") {
      return (
        <span className="inline-flex items-center gap-1 text-role-accent-doctor font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lampiran dokumen analisis AI</span>
        </span>
      );
    }
    return lastMsg.content || "Pesan tidak berformat";
  };

  const avatarUrl =
    patient?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(patient?.full_name || "Pasien")}&background=0d9488&color=fff`;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full text-left p-3.5 border-b border-border/40 cursor-pointer transition-all flex items-start gap-3 relative ${
        isActive
          ? "bg-surface-container-high border-l-4 border-l-role-accent-doctor"
          : "hover:bg-surface-alt bg-surface"
      }`}
    >
      {/* Avatar Pasien */}
      <div className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={patient?.full_name || "Pasien"}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-border/60"
        />
        {isAwaitingReply && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-warning ring-2 ring-surface"
            title="Perlu balasan dokter"
          />
        )}
      </div>

      {/* Info Pasien & Preview Pesan */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h2 className="font-headline-sm text-headline-sm text-ink font-semibold truncate text-[14px]">
            {patient?.full_name || "Pasien SkinCek"}
          </h2>
          {lastMsg && (
            <span className="font-caption text-[11px] text-ink-subtle shrink-0">
              {formatTime(lastMsg.created_at)}
            </span>
          )}
        </div>

        {/* Demografi Singkat */}
        <div className="flex items-center gap-1.5 text-[11px] text-ink-subtle mb-1">
          {patient?.age != null && <span>{patient.age} tahun</span>}
          {patient?.age != null && patient?.gender && <span>•</span>}
          {patient?.gender && <span>{formatGender(patient.gender)}</span>}
        </div>

        {/* Baris Pesan Terakhir & Status */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-body-default text-caption text-ink-muted truncate text-[12px]">
            {renderMessagePreview()}
          </p>
          {isAwaitingReply ? (
            <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-warning/15 text-warning leading-none">
              Respons
            </span>
          ) : (
            <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/15 text-success leading-none">
              Dibalas
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
