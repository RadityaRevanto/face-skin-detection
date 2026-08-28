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
import { MessageList } from "@/src/features/doctor/consultations/components/MessageList";
import { ChatInput } from "@/src/features/doctor/consultations/components/ChatInput";

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
        } md:flex flex-1 flex-col bg-zinc-50/30`}
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
      } md:flex flex-1 flex-col bg-zinc-50/30`}
    >
      {/* Chat Header */}
      <div className="h-18 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onShowSidebar}
            className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-emerald-600 transition-colors"
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
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-zinc-900 text-sm">
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
        <div className="flex items-center gap-3 text-zinc-400">
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
