"use client";

import {
  MessageSquarePlus,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Conversation } from "@/lib/api/consultations-query";
import { ConversationItem } from "./ConversationItem";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  showSidebar: boolean;
  isLoadingConversations: boolean;
  isStartingAi: boolean;
  setActiveConversation: (conv: Conversation) => void;
  setShowSidebar: (val: boolean) => void;
  handleStartAiChat: () => void;
}

export function ConversationSidebar({
  conversations,
  activeConversation,
  showSidebar,
  isLoadingConversations,
  isStartingAi,
  setActiveConversation,
  setShowSidebar,
  handleStartAiChat,
}: ConversationSidebarProps) {
  const router = useRouter();
  return (
    <div className={`
      ${showSidebar ? "flex" : "hidden"} lg:flex
      flex-col
      w-full lg:w-64 xl:w-72
      shrink-0
      h-full lg:h-auto
      bg-white lg:bg-transparent
    `}>
      <div className="flex flex-col gap-4 lg:gap-5 h-full p-4 lg:p-0">
        

        {/* Conversation list container */}
        <div className="flex flex-1 min-h-0 bg-white rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 border border-zinc-200/60 flex-col">
          <div className="flex flex-col w-full h-full min-h-0">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <h2 className="font-semibold text-zinc-800 text-lg">Pesan</h2>
              <button
                onClick={() => router.push("/user/consultations")}
                className="flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-full transition-colors"
                title="Cari dokter untuk konsultasi baru"
              >
                <MessageSquarePlus size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 sm:px-5 pt-4 pb-2 border-b border-zinc-100 shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari riwayat chat..." 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <svg className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* AI Chat Button */}
            <div className="px-3 pt-3 pb-1 shrink-0">
              <button
                onClick={handleStartAiChat}
                disabled={isStartingAi}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-violet-50 to-emerald-50 border border-violet-100 hover:border-violet-300 transition-all text-left disabled:opacity-60"
              >
                <span className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  {isStartingAi ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <Sparkles size={22} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-sm text-zinc-900">Aura Skin</span>
                  <span className="block text-xs text-zinc-500 mt-0.5 truncate">
                    Asisten AI skincare — tanya kapan saja
                  </span>
                </span>
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoadingConversations ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                  <MessageSquarePlus size={32} className="mb-3 text-zinc-300" />
                  <p className="text-sm">Belum ada riwayat konsultasi.</p>
                  <p className="text-xs mt-1">Klik tombol + di atas untuk mencari dokter.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv.uuid}
                    conversation={conv}
                    isActive={activeConversation?.uuid === conv.uuid}
                    onSelect={(c) => {
                      setActiveConversation(c);
                      setShowSidebar(false);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}