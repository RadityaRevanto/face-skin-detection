"use client";

import { useState } from "react";
import { MessageSquarePlus, Search, Sparkles } from "lucide-react";
import { Conversation } from "@/lib/api/consultations-query";
import { ConversationItem } from "./ConversationItem";

export type ConversationFilter = "all" | "unread" | "done";

type ConversationSidebarProps = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  showSidebar: boolean;
  isLoadingConversations: boolean;
  /** Role penampil — menentukan siapa yang dilihat di sidebar. */
  role: "user" | "doctor";
  /** Tampilkan tombol AI chat (hanya user). */
  showAiChat?: boolean;
  isStartingAi?: boolean;
  handleStartAiChat?: () => void;
  /** Callback search (doctor pakai, user static). */
  onSearchChange?: (value: string) => void;
  searchQuery?: string;
  /** Load more (doctor). */
  hasMoreConversations?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onSelectConversation: (conv: Conversation) => void;
  setShowSidebar: (val: boolean) => void;
};

const TABS: { key: ConversationFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "unread", label: "Belum Dibaca" },
  { key: "done", label: "Selesai" },
];

function filterConversations(
  conversations: Conversation[],
  filter: ConversationFilter,
  role: "user" | "doctor",
): Conversation[] {
  if (filter === "all") return conversations;
  return conversations.filter((c) => {
    const lastMsg = c.last_message;
    if (!lastMsg) return filter === "unread";
    if (filter === "unread") {
      return role === "doctor"
        ? lastMsg.sender?.role === "user"
        : lastMsg.sender?.role === "doctor";
    }
    if (filter === "done") {
      return role === "doctor"
        ? lastMsg.sender?.role === "doctor"
        : lastMsg.sender?.role === "user";
    }
    return true;
  });
}

export function ConversationSidebar({
  conversations,
  activeConversation,
  showSidebar,
  isLoadingConversations,
  role,
  showAiChat = false,
  isStartingAi = false,
  handleStartAiChat,
  onSearchChange,
  searchQuery = "",
  hasMoreConversations = false,
  isLoadingMore = false,
  onLoadMore,
  onSelectConversation,
  setShowSidebar,
}: ConversationSidebarProps) {
  const [activeTab, setActiveTab] = useState<ConversationFilter>("all");
  const [localSearch, setLocalSearch] = useState("");

  const effectiveSearch = onSearchChange ? searchQuery : localSearch;
  const effectiveSetSearch = onSearchChange ?? setLocalSearch;

  const searched = conversations.filter((c) => {
    if (!effectiveSearch) return true;
    const name =
      role === "doctor"
        ? c.user?.full_name ?? ""
        : c.doctor?.full_name ?? "";
    return name.toLowerCase().includes(effectiveSearch.toLowerCase());
  });

  const filtered = filterConversations(searched, activeTab, role);

  return (
    <div
      className={`
        ${showSidebar ? "flex" : "hidden"} lg:flex
        flex-col
        w-full lg:w-80 xl:w-96
        shrink-0
        h-full lg:h-auto
        border-r border-zinc-100
      `}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-800 text-lg">Pesan</h2>
            {showAiChat && handleStartAiChat && (
              <button
                onClick={() => {
                  handleStartAiChat();
                  setShowSidebar(false);
                }}
                className="flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-full transition-colors"
                title="Chat dengan Aura Skin"
              >
                <MessageSquarePlus size={20} />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder={role === "doctor" ? "Cari pasien..." : "Cari riwayat chat..."}
              value={effectiveSearch}
              onChange={(e) => effectiveSetSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat Button (user only) */}
        {showAiChat && handleStartAiChat && (
          <div className="px-3 pt-3 pb-1 shrink-0 border-b border-zinc-100">
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
        )}

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoadingConversations ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <MessageSquarePlus size={32} className="mb-3 text-zinc-300" />
              <p className="text-sm">Belum ada percakapan.</p>
              <p className="text-xs mt-1">
                {role === "doctor"
                  ? "Menunggu pasien mengirim pesan."
                  : "Klik tombol + untuk mencari dokter."}
              </p>
            </div>
          ) : (
            <>
              {filtered.map((conv) => (
                <ConversationItem
                  key={conv.uuid}
                  conversation={conv}
                  isActive={activeConversation?.uuid === conv.uuid}
                  role={role}
                  onSelect={(c) => {
                    onSelectConversation(c);
                    setShowSidebar(false);
                  }}
                />
              ))}

              {!isLoadingConversations && hasMoreConversations && onLoadMore && (
                <div className="p-3 border-b border-zinc-50">
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={onLoadMore}
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                  >
                    {isLoadingMore ? "Memuat..." : "Muat percakapan lainnya"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
