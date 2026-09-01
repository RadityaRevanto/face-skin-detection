"use client";

import { RefObject } from "react";
import {
  Send,
  MoreVertical,
  Info,
  ChevronLeft,
} from "lucide-react";
import { Conversation, Message } from "@/lib/api/consultations-query";
import { formatGender } from "@/lib/utils/demographics";
import { MessageList } from "@/features/doctor/consultations/components/MessageList";
import { ChatInput } from "@/features/doctor/consultations/components/ChatInput";

export function ChatPanel({
  activeConversation,
  messages,
  showSidebar,
  selectedImagePreview,
  inputText,
  isSending,
  messagesEndRef,
  fileInputRef,
  onShowSidebar,
  onInputChange,
  onRemoveImage,
  onImageUpload,
  onSendMessage,
  onKeyDown,
}: {
  activeConversation: Conversation | null;
  messages: Message[];
  showSidebar: boolean;
  selectedImagePreview: string | null;
  inputText: string;
  isSending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onShowSidebar: () => void;
  onInputChange: (value: string) => void;
  onRemoveImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  if (!activeConversation) {
    return (
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } lg:flex flex-1 flex-col bg-zinc-50/30`}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <Send size={32} className="text-zinc-300 ml-1" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 mb-2">
            Pilih antrean konsultasi pasien
          </h3>
          <p className="text-sm max-w-sm">
            Anda dapat membalas keluhan, memberikan rekomendasi skincare, atau
            menghentikan sesi konsultasi jika sudah selesai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        !showSidebar ? "flex" : "hidden"
      } lg:flex flex-1 flex-col min-w-0 bg-zinc-50/30`}
    >
      {/* Chat Header */}
      <div className="h-14 sm:h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-3 sm:px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onShowSidebar}
            className="lg:hidden p-2 -ml-1 text-zinc-500 hover:text-emerald-600 transition-colors shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <img
            src={
              activeConversation.user?.avatar_url ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(activeConversation.user?.full_name || "U") +
                "&background=10b981&color=fff"
            }
            alt={activeConversation.user?.full_name || "Akun Dihapus"}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-semibold text-zinc-900 text-sm truncate">
              {activeConversation.user?.full_name || "Akun Dihapus"}
            </h2>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
              {activeConversation.user?.age !== undefined &&
                activeConversation.user?.age !== null && (
                  <>
                    <span>{activeConversation.user?.age} thn</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                  </>
                )}
              <span>{formatGender(activeConversation.user?.gender)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 shrink-0">
          <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors">
            <Info size={20} />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      <ChatInput
        inputText={inputText}
        selectedImagePreview={selectedImagePreview}
        isSending={isSending}
        fileInputRef={fileInputRef}
        onInputChange={onInputChange}
        onRemoveImage={onRemoveImage}
        onImageUpload={onImageUpload}
        onSendMessage={onSendMessage}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
