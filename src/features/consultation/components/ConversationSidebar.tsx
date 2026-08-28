"use client";

import {
  MessageSquarePlus,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Conversation } from "@/lib/api/consultations-query";
import { UserProfile } from "@/lib/api/profile-query";
import { ConversationItem } from "./ConversationItem";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  showSidebar: boolean;
  isLoadingConversations: boolean;
  isStartingAi: boolean;
  userProfile: UserProfile | null;
  setActiveConversation: (conv: Conversation) => void;
  setShowSidebar: (val: boolean) => void;
  setIsModalOpen: (val: boolean) => void;
  handleStartAiChat: () => void;
}

export function ConversationSidebar({
  conversations,
  activeConversation,
  showSidebar,
  isLoadingConversations,
  isStartingAi,
  userProfile,
  setActiveConversation,
  setShowSidebar,
  setIsModalOpen,
  handleStartAiChat,
}: ConversationSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-[85vw] sm:w-80 lg:w-64 xl:w-72
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col bg-white lg:bg-transparent shadow-2xl lg:shadow-none
        h-full lg:h-auto shrink-0
      `}>
        <div className="flex flex-col gap-4 lg:gap-5 h-full lg:h-auto p-4 lg:p-0 overflow-y-auto lg:overflow-visible">
          <div className="shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Konsultasi Medis</h1>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base leading-relaxed">Tanya jawab langsung dengan dokter spesialis kami mengenai hasil skin check Anda.</p>
          </div>

          {/* Quota card */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-4 bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-900/5 shrink-0">
            {userProfile?.subscription_status === "Pro" ? (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                  <Star size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="font-semibold text-amber-600 text-base">SkinCek Pro Aktif</p>
                  <p className="text-sm text-zinc-500 mt-0.5">Konsultasi tanpa batas</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((num) => {
                    const isActive = num <= (userProfile?.remaining_free_messages ?? 3);
                    return (
                      <span key={num} className={`w-10 h-10 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"} border-2 border-white flex items-center justify-center font-bold text-sm z-${30 - num * 10}`}>
                        {num}
                      </span>
                    );
                  })}
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 text-base">Sisa Kuota Gratis</p>
                  <p className="text-sm text-zinc-500 mt-0.5">{userProfile?.remaining_free_messages ?? 3} dari 3 sesi tersisa</p>
                </div>
              </>
            )}
          </div>

          {/* Conversation list container */}
          <div className="flex flex-1 min-h-0 bg-white rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 border border-zinc-200/60 flex-col">
            <div className="flex flex-col w-full h-full min-h-0">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <h2 className="font-semibold text-zinc-800 text-lg">Pesan</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-full transition-colors"
                    title="Mulai Chat Baru"
                  >
                    <MessageSquarePlus size={20} />
                  </button>
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-600 p-2 rounded-full transition-colors"
                    title="Tutup"
                  >
                    <X size={20} />
                  </button>
                </div>
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
    </>
  );
}
