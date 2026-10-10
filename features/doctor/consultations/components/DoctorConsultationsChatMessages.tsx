"use client";

import { useEffect, useRef } from "react";
import { Clock, ShieldCheck } from "lucide-react";
import type { Message } from "@/lib/api/consultations-query";
import { formatTime } from "@/features/consultation/utils/consultationHelpers";
import { ChatMessageContent } from "@/features/consultation/components/ChatMessageContent";

type DoctorConsultationsChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
};

export function DoctorConsultationsChatMessages({
  messages,
  isLoading,
}: DoctorConsultationsChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const firstMessage = messages[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-container-low min-h-0 space-y-3">
      {/* 1. Header Waktu Sesi Dimulai */}
      {firstMessage && (
        <div className="flex justify-center mb-4">
          <div className="bg-surface border border-border/50 text-ink-muted text-[11px] font-medium py-1 px-3 rounded-full shadow-xs inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-role-accent-doctor" />
            <span>
              Sesi dimulai{" "}
              {new Date(firstMessage.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-ink-subtle">•</span>
            <span className="inline-flex items-center gap-1 text-role-accent-doctor">
              <ShieldCheck className="w-3 h-3" />
              Klinis Terverifikasi
            </span>
          </div>
        </div>
      )}

      {/* 2. Loading State */}
      {isLoading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} animate-pulse`}
            >
              <div
                className={`h-16 rounded-2xl w-2/3 ${
                  i % 2 === 0 ? "bg-role-accent-doctor/15" : "bg-surface"
                }`}
              />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-role-accent-doctor mb-2 shadow-xs border border-border/40">
            <Clock className="w-6 h-6" />
          </div>
          <p className="font-headline-sm text-sm font-semibold text-ink">
            Belum Ada Riwayat Pesan
          </p>
          <p className="font-caption text-caption text-ink-muted max-w-xs mt-0.5">
            Mulai percakapan dengan menyapa pasien atau memberikan tanggapan klinis pertama.
          </p>
        </div>
      ) : (
        /* 3. Daftar Bubble Pesan */
        messages.map((message, index) => {
          const isDoctor = message.sender?.role === "doctor";
          const isFirstInGroup =
            index === 0 || messages[index - 1].sender?.uuid !== message.sender?.uuid;

          return (
            <div
              key={message.uuid}
              className={`flex ${isDoctor ? "justify-end" : "justify-start"} ${
                isFirstInGroup ? "mt-3" : "mt-1"
              }`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] p-3 shadow-xs transition-all ${
                  isDoctor
                    ? "bg-role-accent-doctor text-white rounded-2xl rounded-tr-xs"
                    : "bg-surface text-ink border border-border/50 rounded-2xl rounded-tl-xs"
                }`}
              >
                {/* Lampiran Gambar */}
                {message.type === "image" && message.media_url && (
                  <div className="mb-2 relative overflow-hidden rounded-xl border border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.media_url}
                      alt="Lampiran foto"
                      className="max-w-full sm:max-w-sm max-h-72 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Konten Teks atau Hasil Scan AI */}
                {message.content && (
                  <div className={isDoctor ? "text-white [&_*]:text-white" : ""}>
                    <ChatMessageContent content={message.content} type={message.type} />
                  </div>
                )}

                {/* Timestamp & Penanda Pengirim */}
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <span
                    className={`text-[10px] ${
                      isDoctor ? "text-white/80" : "text-ink-subtle"
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
