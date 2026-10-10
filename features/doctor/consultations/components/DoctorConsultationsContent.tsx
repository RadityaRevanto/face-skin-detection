"use client";

import { AlertCircle } from "lucide-react";
import { useDoctorConsultations } from "../hooks/useDoctorConsultations";
import { DoctorConsultationsHeader } from "./DoctorConsultationsHeader";
import { DoctorConsultationsSidebar } from "./DoctorConsultationsSidebar";
import { DoctorConsultationsChatPanel } from "./DoctorConsultationsChatPanel";

export function DoctorConsultationsContent() {
  const {
    filteredConversations,
    activeConversation,
    setActiveConversation,
    messages,
    showSidebar,
    setShowSidebar,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    errorMessage,
    setErrorMessage,
    kpis,
    refreshConversations,
    handleSendMessage,
  } = useDoctorConsultations();

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Klinis & Telemetri KPI */}
      <DoctorConsultationsHeader
        kpis={kpis}
        isLoading={isLoadingConversations}
        onRefresh={refreshConversations}
      />

      {/* 2. Banner Notifikasi Error jika ada */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 flex items-center justify-between text-error text-caption font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[12px] underline hover:no-underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 3. Card Kontainer Konsultasi Terpadu */}
      <div className="bg-surface rounded-2xl shadow-xs border border-border/50 overflow-hidden flex flex-col h-[700px]">
        <div className="flex-1 flex overflow-hidden">
          {/* Kolom Kiri: Sidebar Daftar Pasien */}
          <div
            className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
              showSidebar ? "block" : "hidden md:block"
            }`}
          >
            <DoctorConsultationsSidebar
              conversations={filteredConversations}
              activeConversation={activeConversation}
              onSelectConversation={(conv) => {
                setActiveConversation(conv);
                setShowSidebar(false);
              }}
              isLoading={isLoadingConversations}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Kolom Kanan: Panel Chat Konsultasi */}
          <div
            className={`flex-1 h-full flex flex-col ${
              !showSidebar ? "block" : "hidden md:flex"
            }`}
          >
            <DoctorConsultationsChatPanel
              activeConversation={activeConversation}
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              isSending={isSending}
              onBack={() => setShowSidebar(true)}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
