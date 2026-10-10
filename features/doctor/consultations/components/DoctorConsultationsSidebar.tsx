"use client";

import { Search, Users, AlertCircle } from "lucide-react";
import type { Conversation } from "@/lib/api/consultations-query";
import type { DoctorConsultationFilter } from "../types";
import { DoctorConsultationsPatientItem } from "./DoctorConsultationsPatientItem";

type DoctorConsultationsSidebarProps = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conv: Conversation) => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: DoctorConsultationFilter;
  onTabChange: (tab: DoctorConsultationFilter) => void;
};

export function DoctorConsultationsSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  isLoading,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}: DoctorConsultationsSidebarProps) {
  const tabs: { key: DoctorConsultationFilter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "unread", label: "Perlu Balasan" },
    { key: "done", label: "Selesai" },
  ];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border/50">
      {/* 1. Baris Pencarian Pasien */}
      <div className="p-3.5 border-b border-border/40">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama pasien..."
            className="w-full pl-9 pr-3.5 py-2 text-caption bg-surface-alt border border-border/50 rounded-xl text-ink placeholder:text-ink-subtle focus:outline-hidden focus:ring-2 focus:ring-role-accent-doctor/30 focus:border-role-accent-doctor transition-all"
          />
        </div>

        {/* 2. Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 p-1 bg-surface-container-low rounded-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 py-1 px-2 text-[12px] font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  isActive
                    ? "bg-surface text-role-accent-doctor shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Daftar Antrean Pasien */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/20">
        {isLoading ? (
          <div className="p-6 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-surface-alt shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-surface-alt rounded-sm w-3/4" />
                  <div className="h-3 bg-surface-alt rounded-sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-64 gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-ink-subtle">
              {searchQuery ? <AlertCircle className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <p className="font-headline-sm text-[13px] font-semibold text-ink">
              {searchQuery ? "Tidak ditemukan" : "Antrean kosong"}
            </p>
            <p className="font-caption text-[11px] text-ink-muted max-w-[200px]">
              {searchQuery
                ? "Tidak ada pasien yang cocok dengan kata kunci."
                : "Belum ada sesi konsultasi pasien aktif."}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <DoctorConsultationsPatientItem
              key={conv.uuid}
              conversation={conv}
              isActive={activeConversation?.uuid === conv.uuid}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
