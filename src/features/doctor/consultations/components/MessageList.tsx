"use client";

import { RefObject } from "react";
import { Check, Clock } from "lucide-react";
import { Message } from "@/lib/api/consultations-query";
import { ChatMessageContent } from "@/src/features/consultation/components/ChatMessageContent";

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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-chat-surface">
      <div className="flex justify-center mb-6 mt-2">
        <div className="bg-chat-notice text-zinc-600 text-xs py-1.5 px-3 rounded-lg shadow-sm font-medium inline-flex items-center gap-1.5">
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
                  ? "bg-chat-bubble-own text-chat-bubble-text rounded-lg rounded-tr-none"
                  : "bg-white text-chat-bubble-text rounded-lg rounded-tl-none"
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

              {message.content && (
                <ChatMessageContent content={message.content} type={message.type} />
              )}

              <div className="flex items-center gap-1 shrink-0 ml-auto mt-1">
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
        );
      })}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
}
