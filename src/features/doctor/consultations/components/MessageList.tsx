"use client";

import { RefObject } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { Message } from "@/lib/api/consultations-query";

const formatTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function MessageList({
  messages,
  messagesEndRef,
}: {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#efeae2]">
      <div className="flex justify-center mb-6 mt-2">
        <div className="bg-[#ffeecd] text-zinc-600 text-xs py-1.5 px-3 rounded-lg shadow-sm font-medium inline-flex items-center gap-1.5">
          <Clock size={12} />
          Sesi Konsultasi Dimulai
        </div>
      </div>

      {messages.map((message, index) => {
        const isDoctor = message.sender?.role === "doctor";
        const isFirstInGroup =
          index === 0 ||
          messages[index - 1].sender?.uuid !== message.sender?.uuid;

        return (
          <div
            key={message.uuid}
            className={`flex ${isDoctor ? "justify-end" : "justify-start"} ${
              isFirstInGroup ? "mt-3" : "mt-1"
            }`}
          >
            <div
              className={`relative max-w-[85%] md:max-w-[70%] px-2.5 py-1.5 shadow-sm ${
                isDoctor
                  ? "bg-[#d9fdd3] text-[#111b21] rounded-lg rounded-tr-none"
                  : "bg-white text-[#111b21] rounded-lg rounded-tl-none"
              }`}
            >
              {message.type === "image" && message.media_url && (
                <div className="mb-1 relative overflow-hidden rounded-md">
                  <img
                    src={message.media_url}
                    alt="Uploaded content"
                    className="max-w-full sm:max-w-70 max-h-75 object-cover"
                  />
                </div>
              )}

              {message.type === "scan_result" && (
                <div className="mb-2 w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-sm mt-1">
                  <div className="bg-[#00a884] text-white px-3 py-1.5 flex items-center gap-2">
                    <CheckCheck size={16} />
                    <span className="font-semibold text-xs tracking-wide">
                      LAPORAN SCAN KULIT PASIEN
                    </span>
                  </div>
                  <div className="p-3 pb-1 text-sm text-zinc-700 leading-relaxed border-b border-zinc-100">
                    {message.content}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-end gap-x-2 gap-y-0.5">
                {message.content && (
                  <p className="text-[14.5px] leading-snug wrap-break-word">
                    {message.content}
                    <span className="inline-block w-15" aria-hidden="true"></span>
                  </p>
                )}

                <div className="flex items-center gap-1 shrink-0 ml-auto absolute bottom-1.5 right-2">
                  <span className="text-[10px] text-zinc-500 leading-none">
                    {formatTime(message.created_at)}
                  </span>
                  {isDoctor && (
                    <span className="text-zinc-400">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
}
