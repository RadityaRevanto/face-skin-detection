"use client";

import { RefObject } from "react";
import {
  Send,
  MoreVertical,
  Info,
  ChevronLeft,
  Star,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Conversation } from "@/lib/api/consultations-query";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { isAiBotConversation } from "../utils/consultationHelpers";

interface ChatPanelProps {
  activeConversation: Conversation | null;
  messages: any[];
  showSidebar: boolean;
  inputText: string;
  selectedImagePreview: string | null;
  isSending: boolean;
  setShowSidebar: (val: boolean) => void;
  setIsRatingModalOpen: (val: boolean) => void;
  setIsScanModalOpen: (val: boolean) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImageFile: (file: File | null) => void;
  setSelectedImagePreview: (val: string | null) => void;
  setInputText: (val: string) => void;
  handleDeleteAiHistory: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function ChatPanel({
  activeConversation,
  messages,
  showSidebar,
  inputText,
  selectedImagePreview,
  isSending,
  setShowSidebar,
  setIsRatingModalOpen,
  setIsScanModalOpen,
  handleSendMessage,
  handleImageUpload,
  setSelectedImageFile,
  setSelectedImagePreview,
  setInputText,
  handleDeleteAiHistory,
  fileInputRef,
  messagesEndRef,
}: ChatPanelProps) {
  return (
    <div className={`${showSidebar ? "hidden" : "flex"} lg:flex flex-1 flex-col min-w-0 min-h-0 bg-white rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 border border-zinc-200/60`}>
      <div className="flex flex-1 flex-col bg-zinc-50/30 min-h-0">
        {activeConversation ? (
          <>
            {(() => {
              const activeIsBot = isAiBotConversation(activeConversation);
              return (
                <div className="h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-emerald-600 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    {activeIsBot ? (
                      <span className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Sparkles size={18} />
                      </span>
                    ) : (
                      <img
                        src={activeConversation.doctor?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(activeConversation.doctor?.full_name || "D") + "&background=10b981&color=fff"}
                        alt={activeConversation.doctor?.full_name || "Akun Dihapus"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <h2 className={`font-semibold text-zinc-900 text-sm truncate ${activeIsBot ? "text-violet-700" : ""}`}>
                        {activeIsBot ? "Aura Skin" : activeConversation.doctor?.full_name || "Akun Dihapus"}
                      </h2>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        {activeIsBot ? "Asisten AI" : "Dokter"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-zinc-400 shrink-0">
                    {activeIsBot ? (
                      <button
                        onClick={handleDeleteAiHistory}
                        title="Hapus riwayat chat AI"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full text-xs font-semibold transition-colors"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Hapus Riwayat</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsRatingModalOpen(true)}
                          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full text-xs font-semibold transition-colors"
                        >
                          <Star size={14} className="fill-amber-400" />
                          Beri Ulasan
                        </button>
                        <button
                          onClick={() => setIsRatingModalOpen(true)}
                          className="sm:hidden hover:text-amber-500 transition-colors"
                          title="Beri Ulasan"
                        >
                          <Star size={20} />
                        </button>
                      </>
                    )}
                    <button className="hover:text-zinc-600 transition-colors"><Info size={20} /></button>
                    <button className="hover:text-zinc-600 transition-colors"><MoreVertical size={20} /></button>
                  </div>
                </div>
              );
            })()}

            <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

            <ChatInput
              inputText={inputText}
              selectedImagePreview={selectedImagePreview}
              isSending={isSending}
              handleSendMessage={handleSendMessage}
              handleImageUpload={handleImageUpload}
              setSelectedImageFile={setSelectedImageFile}
              setSelectedImagePreview={setSelectedImagePreview}
              setInputText={setInputText}
              setIsScanModalOpen={setIsScanModalOpen}
              fileInputRef={fileInputRef}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-zinc-300 ml-1" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Pilih pesan untuk mulai membaca</h3>
            <p className="text-sm max-w-sm">Anda dapat berkonsultasi mengenai kondisi kulit, hasil scan, atau rekomendasi skincare dengan dokter kami.</p>
          </div>
        )}
      </div>
    </div>
  );
}
