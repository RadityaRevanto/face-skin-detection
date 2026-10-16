"use client";

import { ArrowLeft, MessageSquare, Shield, Activity } from "lucide-react";
import type { Conversation, Message } from "@/lib/api/consultations-query";
import { formatGender } from "@/lib/utils/demographics";
import { DoctorConsultationsChatMessages } from "./DoctorConsultationsChatMessages";
import { DoctorConsultationsChatInput } from "./DoctorConsultationsChatInput";

type DoctorConsultationsChatPanelProps = {
  activeConversation: Conversation | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isSending: boolean;
  onBack: () => void;
  onSendMessage: (content: string, mediaFile: File | null) => Promise<void>;
};

export function DoctorConsultationsChatPanel({
  activeConversation,
  messages,
  isLoadingMessages,
  isSending,
  onBack,
  onSendMessage,
}: DoctorConsultationsChatPanelProps) {
  // Empty State bila belum ada pasien yang dipilih
  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/40 h-full">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border/60 shadow-xs flex items-center justify-center text-role-accent-doctor mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="font-display text-headline-lg text-ink font-semibold tracking-tight">
          Pilih Pasien untuk Memulai Sesi
        </h2>
        <p className="font-body-default text-body-default text-ink-muted max-w-md mt-1.5">
          Pilih salah satu rekam antrean pasien di bilah sisi kiri untuk membaca keluhan,
          mengevaluasi foto analisis AI, dan meresepkan rekomendasi perawatan.
        </p>
        <div className="flex items-center gap-2 mt-6 px-3.5 py-1.5 rounded-full bg-surface border border-border/50 text-[11px] text-ink-subtle">
          <Shield className="w-3.5 h-3.5 text-role-accent-doctor" />
          <span>Sistem Komunikasi Telemedisin Dokter Terenkripsi SkinCek</span>
        </div>
      </div>
    );
  }

  const patient = activeConversation.user;
  const avatarUrl =
    patient?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(patient?.full_name || "Pasien")}&background=0d9488&color=fff`;

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-hidden">
      {/* 1. Header Pasien Aktif */}
      <div className="px-4 py-3.5 border-b border-border/40 bg-surface flex items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {/* Tombol Back di Mobile */}
          <button
            type="button"
            onClick={onBack}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
            title="Kembali ke antrean"
            aria-label="Kembali ke daftar antrean"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar Pasien */}
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={patient?.full_name || "Pasien"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-role-accent-doctor/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-surface" />
          </div>

          {/* Profil Pasien */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-headline-sm text-ink font-semibold truncate text-[15px]">
                {patient?.full_name || "Pasien SkinCek"}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-role-accent-doctor/10 text-role-accent-doctor">
                <Activity className="w-3 h-3" />
                Telekonsultasi Aktif
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5">
              {patient?.age != null && <span>{patient.age} tahun</span>}
              {patient?.age != null && patient?.gender && <span>•</span>}
              {patient?.gender && <span>{formatGender(patient.gender)}</span>}
              <span className="hidden sm:inline">• Pasien Terdaftar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Area Pesan Chat */}
      <DoctorConsultationsChatMessages
        messages={messages}
        isLoading={isLoadingMessages}
      />

      {/* 3. Area Input Kirim Pesan */}
      <DoctorConsultationsChatInput
        isSending={isSending}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
