"use client";

import { Search } from "lucide-react";
import { Conversation, Message } from "@/lib/api/consultations-query";

const formatTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function ConversationSidebar({
  conversations,
  activeConversation,
  searchQuery,
  isLoadingConversations,
  showSidebar,
  hasMoreConversations,
  isLoadingMore,
  onSearchChange,
  onSelectConversation,
  onLoadMore,
}: {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  searchQuery: string;
  isLoadingConversations: boolean;
  showSidebar: boolean;
  hasMoreConversations: boolean;
  isLoadingMore: boolean;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conv: Conversation) => void;
  onLoadMore: () => void;
}) {
  const filtered = conversations.filter((c) =>
    c.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`${
        showSidebar ? "flex" : "hidden"
      } lg:flex w-full lg:w-80 xl:w-96 border-r border-zinc-100 flex-col shrink-0`}
    >
      <div className="p-4 sm:p-5 border-b border-zinc-100">
        <h2 className="font-semibold text-zinc-800 text-lg">Pesan Masuk</h2>
        <div className="mt-3 sm:mt-4 relative">
          <input
            type="text"
            placeholder="Cari pasien..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
        </div>

        <div className="flex gap-2 mt-3 sm:mt-4">
          <button className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg">
            Semua
          </button>
          <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 text-xs font-medium rounded-lg transition-colors">
            Belum Dibaca
          </button>
          <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 text-xs font-medium rounded-lg transition-colors">
            Selesai
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-8 text-zinc-500 text-sm">
            Belum ada pesan masuk
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = activeConversation?.uuid === conv.uuid;
            return (
              <div
                key={conv.uuid}
                onClick={() => onSelectConversation(conv)}
                className={`p-4 border-b border-zinc-50 cursor-pointer transition-all hover:bg-zinc-50 flex flex-col gap-2 ${
                  isActive ? "bg-emerald-50/50 relative" : ""
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                )}

                <div className="flex items-center gap-4">
                  <img
                    src={
                      conv.user?.avatar_url ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(conv.user?.full_name || "U") +
                        "&background=10b981&color=fff"
                    }
                    alt={conv.user?.full_name || "Akun Dihapus"}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-zinc-900 truncate text-sm">
                        {conv.user?.full_name || "Akun Dihapus"}
                      </h3>
                      {conv.last_message && (
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {formatTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs truncate text-zinc-500">
                        {conv.last_message ? (
                          conv.last_message.type === "image"
                            ? "📷 Foto"
                            : conv.last_message.type === "scan_result"
                            ? "📋 Hasil Scan"
                            : conv.last_message.content
                        ) : (
                          "Belum ada pesan"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!isLoadingConversations && hasMoreConversations && (
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
      </div>
    </div>
  );
}
