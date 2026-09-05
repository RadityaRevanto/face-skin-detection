"use client";

import { RefObject } from "react";
import { Send, MoreVertical, Info, ChevronLeft, Star, Sparkles, Trash2 } from "lucide-react";
import { Conversation, Message } from "@/lib/api/consultations-query";
import { isAiBotConversation } from "../utils/consultationHelpers";
import { formatGender } from "@/lib/utils/demographics";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

type ChatPanelProps = {
  activeConversation: Conversation | null;
  messages: Message[];
  showSidebar: boolean;
  role: "user" | "doctor";
  inputText: string;
  selectedImagePreview: string | null;
  isSending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onShowSidebar: () => void;
  onInputChange: (value: string) => void;
  onRemoveImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** User-only: buka modal scan history. */
  onOpenScanModal?: () => void;
  /** User-only: buka modal rating. */
  onOpenRatingModal?: () => void;
  /** User-only: hapus riwayat AI. */
  onDeleteAiHistory?: () => void;
};

export function ChatPanel({
  activeConversation,
  messages,
  showSidebar,
  role,
  inputText,
  selectedImagePreview,
  isSending,
  messagesEndRef,
  fileInputRef,
  onShowSidebar,
  onInputChange,
  onRemoveImage,
  onImageUpload,
  onSendMessage,
  onKeyDown,
  onOpenScanModal,
  onOpenRatingModal,
  onDeleteAiHistory,
}: ChatPanelProps) {
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
            {role === "doctor"
              ? "Pilih antrean konsultasi pasien"
              : "Pilih pesan untuk mulai membaca"}
          </h3>
          <p className="text-sm max-w-sm">
            {role === "doctor"
              ? "Anda dapat membalas keluhan, memberikan rekomendasi skincare, atau menghentikan sesi konsultasi jika sudah selesai."
              : "Anda dapat berkonsultasi mengenai kondisi kulit, hasil scan, atau rekomendasi skincare dengan dokter kami."}
          </p>
        </div>
      </div>
    );
  }

  const isBot = role === "user" && isAiBotConversation(activeConversation);
  const contact = role === "doctor" ? activeConversation.user : activeConversation.doctor;

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

          {isBot ? (
            <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-violet-500 to-emerald-500 text-white flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </span>
          ) : (
            <img
              src={contact?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(contact?.full_name || (role === "doctor" ? "U" : "D")) + "&background=10b981&color=fff"}
              alt={contact?.full_name || "Akun Dihapus"}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
            />
          )}

          <div className="min-w-0">
            <h2 className={`font-semibold text-zinc-900 text-sm truncate ${isBot ? "text-violet-700" : ""}`}>
              {isBot ? "Aura Skin" : contact?.full_name || "Akun Dihapus"}
            </h2>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
              {role === "doctor" && activeConversation.user?.age != null && (
                <>
                  <span>{activeConversation.user.age} thn</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                </>
              )}
              {role === "doctor" && activeConversation.user?.gender && (
                <span>{formatGender(activeConversation.user.gender)}</span>
              )}
              {isBot && <span>Asisten AI</span>}
              {role === "user" && !isBot && <span>Dokter</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 shrink-0">
          {isBot && onDeleteAiHistory ? (
            <button
              onClick={onDeleteAiHistory}
              title="Hapus riwayat chat AI"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full text-xs font-semibold transition-colors"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Hapus Riwayat</span>
            </button>
          ) : role === "user" && onOpenRatingModal ? (
            <>
              <button
                onClick={onOpenRatingModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full text-xs font-semibold transition-colors"
              >
                <Star size={14} className="fill-amber-400" />
                Beri Ulasan
              </button>
              <button
                onClick={onOpenRatingModal}
                className="sm:hidden hover:text-amber-500 transition-colors"
                title="Beri Ulasan"
              >
                <Star size={20} />
              </button>
            </>
          ) : null}
          <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors">
            <Info size={20} />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} role={role} />

      <ChatInput
        inputText={inputText}
        selectedImagePreview={selectedImagePreview}
        isSending={isSending}
        fileInputRef={fileInputRef}
        role={role}
        onInputChange={onInputChange}
        onRemoveImage={onRemoveImage}
        onImageUpload={onImageUpload}
        onSendMessage={onSendMessage}
        onKeyDown={onKeyDown}
        onOpenScanModal={onOpenScanModal}
      />
    </div>
  );
}
