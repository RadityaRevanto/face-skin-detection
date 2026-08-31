"use client";

import { Sparkles } from "lucide-react";
import { Conversation } from "@/lib/api/consultations-query";
import { isAiBotConversation, formatTime } from "../utils/consultationHelpers";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conv: Conversation) => void;
}

export function ConversationItem({ conversation, isActive, onSelect }: ConversationItemProps) {
  const isBot = isAiBotConversation(conversation);

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`p-4 border-b border-zinc-50 cursor-pointer transition-all hover:bg-zinc-50 flex flex-col gap-2 relative ${isActive ? "bg-emerald-50/50" : ""}`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
      )}

      <div className="flex items-center gap-4">
        {isBot ? (
          <span className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-emerald-500 text-white flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </span>
        ) : (
          <img
            src={conversation.doctor?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(conversation.doctor?.full_name || "D") + "&background=10b981&color=fff"}
            alt={conversation.doctor?.full_name || "Akun Dihapus"}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className={`font-semibold text-zinc-900 truncate text-sm ${isBot ? "text-violet-700" : ""}`}>
              {isBot ? "Aura Skin" : conversation.doctor?.full_name || "Akun Dihapus"}
            </h3>
            {conversation.last_message && (
              <span className="text-[10px] text-zinc-400 shrink-0">
                {formatTime(conversation.last_message.created_at)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs truncate text-zinc-500">
              {conversation.last_message ? (
                conversation.last_message.type === "image" ? "📷 Foto" :
                conversation.last_message.type === "scan_result" ? "📋 Hasil Scan" :
                conversation.last_message.content
              ) : (
                isBot ? "Tanyakan kondisi kulitmu di sini" : "Belum ada pesan"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
