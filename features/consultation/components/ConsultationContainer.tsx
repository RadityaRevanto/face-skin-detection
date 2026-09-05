"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  getConversations,
  getMessages,
  sendMessage,
  startAiConversation,
  deleteAiConversation,
  Conversation,
  Message,
} from "@/lib/api/consultations-query";
import { getEcho } from "@/lib/echo";
import { aiChatService } from "@/features/ai-chat/services/aiChatService";
import { type PredictionResult } from "@/features/scan/services/scanService";
import { ErrorPopup } from "./ErrorPopup";
import { AiConsentModal } from "./AiConsentModal";
import { ScanHistoryModal } from "./ScanHistoryModal";
import { DoctorRatingModal } from "./DoctorRatingModal";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatPanel } from "./ChatPanel";
import { ErrorCta, buildApiError, isConsentRequiredError } from "../utils/consultationHelpers";

type ConsultationContainerProps = {
  role: "user" | "doctor";
};

export function ConsultationContainer({ role }: ConsultationContainerProps) {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputText, setInputText] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isStartingAi, setIsStartingAi] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string; cta?: ErrorCta } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Modal persetujuan AI (muncul saat 403 consent saat mulai chat Aura Skin).
  const [aiConsentModal, setAiConsentModal] = useState<{
    text: string | null;
    isSubmitting: boolean;
  } | null>(null);

  const showApiError = (error: unknown) => setErrorState(buildApiError(error));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, selectedImagePreview, isLoadingMessages]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await getConversations(1);
      setConversations(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await getMessages(conversationId, 1);
      setMessages([...(res.data || [])].reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Buka conversation spesifik via ?c=<uuid> (user: dari halaman profil dokter).
  const initialConversationId = searchParams.get("c");
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  useEffect(() => {
    if (initializedFromUrl || isLoadingConversations || !initialConversationId) return;
    const target = conversations.find((c) => c.uuid === initialConversationId);
    if (target) {
      setActiveConversation(target);
      setShowSidebar(false);
      setInitializedFromUrl(true);
    }
  }, [conversations, isLoadingConversations, initialConversationId, initializedFromUrl]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    fetchMessages(activeConversation.uuid);
    const echo = getEcho();
    if (!echo) return;
    const channelName = `conversation.${activeConversation.uuid}`;
    // BE MessageSent::broadcastAs() = 'message.sent' (App\Events\MessageSent).
    echo.private(channelName).listen(".message.sent", (e: { message?: Message }) => {
      if (!e.message) return;
      setMessages((prev) =>
        prev.some((m) => m.uuid === e.message!.uuid) ? prev : [...prev, e.message!],
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.uuid === activeConversation.uuid
            ? { ...c, last_message: e.message }
            : c,
        ),
      );
    });
    return () => {
      echo.leave(channelName);
    };
  }, [activeConversation, fetchMessages]);

  const openAiConversation = async () => {
    const res = await startAiConversation();
    // Response envelope: { data: Conversation } — ambil objeknya, bukan wrapper.
    const conv = (res.data ?? res) as Conversation;
    if (!conv?.uuid) {
      throw new Error("Gagal memulai chat dengan Aura Skin");
    }
    setConversations((prev) =>
      prev.some((c) => c.uuid === conv.uuid) ? prev : [conv, ...prev],
    );
    setActiveConversation(conv);
    setShowSidebar(false);
  };

  /**
   * Buka modal consent AI dengan teks dari BE.
   * Dipakai saat 403 consent — baik saat mulai chat maupun kirim pesan.
   */
  const openConsentModalFromError = async () => {
    const text = await aiChatService
      .getConsent()
      .then((c) => c?.text ?? null)
      .catch(() => null);
    setAiConsentModal({ text, isSubmitting: false });
  };

  /**
   * Mulai chat Aura Skin. Jika BE 403 (belum consent), JANGAN tampilkan pesan
   * error generik — buka modal persetujuan AI (teks sama seperti kartu di
   * /user/profile/privacy). Setelah setuju → lanjut start chat otomatis.
   */
  const handleStartAiChat = async () => {
    if (isStartingAi) return;
    setIsStartingAi(true);
    try {
      await openAiConversation();
    } catch (error) {
      if (isConsentRequiredError(error)) {
        await openConsentModalFromError();
        return;
      }
      showApiError(error);
    } finally {
      setIsStartingAi(false);
    }
  };

  /** Callback modal consent: simpan persetujuan → langsung buka conversation. */
  const handleAiConsentAccepted = async () => {
    setAiConsentModal((m) => (m ? { ...m, isSubmitting: true } : null));
    try {
      await aiChatService.updateConsent(true);
      setAiConsentModal(null);
      await openAiConversation();
    } catch (error) {
      setAiConsentModal(null);
      showApiError(error);
    } finally {
      setIsStartingAi(false);
    }
  };

  const handleDeleteAiHistory = async () => {
    if (!activeConversation) return;
    if (!window.confirm("Hapus seluruh riwayat chat dengan Aura Skin?")) return;
    try {
      await deleteAiConversation(activeConversation.uuid);
      const removedUuid = activeConversation.uuid;
      setConversations((prev) => prev.filter((c) => c.uuid !== removedUuid));
      setActiveConversation(null);
      setShowSidebar(true);
      setSuccessMsg("Riwayat chat Aura Skin telah dihapus.");
    } catch (error) {
      showApiError(error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || (!inputText.trim() && !selectedImageFile)) return;
    setIsSending(true);
    try {
      let payload;
      if (selectedImageFile) {
        payload = new FormData();
        if (inputText.trim()) payload.append("content", inputText.trim());
        payload.append("media", selectedImageFile);
      } else {
        payload = { content: inputText.trim() };
      }
      const res = await sendMessage(activeConversation.uuid, payload);
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) =>
        prev.map((c) =>
          c.uuid === activeConversation.uuid
            ? { ...c, last_message: res.data }
            : c,
        ),
      );
      setInputText("");
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
    } catch (error) {
      // Chat AI aktif tapi consent dicabut — buka modal consent, bukan popup error.
      if (isConsentRequiredError(error)) {
        openConsentModalFromError();
        return;
      }
      showApiError(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendScanHistory = async (scan: PredictionResult) => {
    setIsScanModalOpen(false);
    if (!activeConversation) return;
    setIsSending(true);
    try {
      const scanPayload = {
        kondisi: scan.skin_concern?.name ?? scan.predicted_class,
        akurasi: `${(scan.confidence * 100).toFixed(1)}%`,
        probabilitas: Object.fromEntries(
          (scan.other_concerns ?? []).map((c) => [
            c.name ?? c.ml_label,
            `${(c.confidence * 100).toFixed(0)}%`,
          ]),
        ),
        tanggal: new Date(scan.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        fotoUrl: scan.image_url,
      };
      const res = await sendMessage(activeConversation.uuid, {
        content: JSON.stringify(scanPayload),
        prediction_history_id: scan.uuid,
      });
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) =>
        prev.map((c) =>
          c.uuid === activeConversation.uuid
            ? { ...c, last_message: res.data }
            : c,
        ),
      );
    } catch (error) {
      if (isConsentRequiredError(error)) {
        openConsentModalFromError();
        return;
      }
      showApiError(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="bg-shell flex flex-col h-full overflow-hidden">
      <ErrorPopup
        errorState={errorState}
        setErrorState={setErrorState}
        successMsg={successMsg}
        setSuccessMsg={setSuccessMsg}
      />

      {aiConsentModal && (
        <AiConsentModal
          consentText={aiConsentModal.text}
          isSubmitting={aiConsentModal.isSubmitting}
          onCancel={() => setAiConsentModal(null)}
          onAccept={handleAiConsentAccepted}
        />
      )}

      {role === "user" && (
        <>
          <ScanHistoryModal
            isOpen={isScanModalOpen}
            onClose={() => setIsScanModalOpen(false)}
            onSelectScan={handleSendScanHistory}
          />
          {activeConversation && (
            <DoctorRatingModal
              isOpen={isRatingModalOpen}
              onClose={() => setIsRatingModalOpen(false)}
              doctorId={activeConversation.doctor?.uuid}
              doctorName={activeConversation.doctor?.full_name || "Dokter"}
              onSuccess={() => {
                setIsRatingModalOpen(false);
                setSuccessMsg("Terima kasih, ulasan Anda berhasil disimpan.");
              }}
            />
          )}
        </>
      )}

      <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col lg:flex-row lg:gap-6 lg:p-8 min-h-0">
        <ConversationSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          showSidebar={showSidebar}
          isLoadingConversations={isLoadingConversations}
          role={role}
          showAiChat={role === "user"}
          isStartingAi={isStartingAi}
          handleStartAiChat={handleStartAiChat}
          searchQuery={searchQuery}
          onSearchChange={role === "doctor" ? setSearchQuery : undefined}
          onSelectConversation={(conv) => {
            setActiveConversation(conv);
            setShowSidebar(false);
          }}
          setShowSidebar={setShowSidebar}
        />

        <ChatPanel
          activeConversation={activeConversation}
          messages={messages}
          showSidebar={showSidebar}
          role={role}
          inputText={inputText}
          selectedImagePreview={selectedImagePreview}
          isSending={isSending}
          messagesEndRef={messagesEndRef}
          fileInputRef={fileInputRef}
          onShowSidebar={() => setShowSidebar(true)}
          onInputChange={setInputText}
          onRemoveImage={() => {
            setSelectedImageFile(null);
            setSelectedImagePreview(null);
          }}
          onImageUpload={handleImageUpload}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
          onOpenScanModal={role === "user" ? () => setIsScanModalOpen(true) : undefined}
          onOpenRatingModal={role === "user" ? () => setIsRatingModalOpen(true) : undefined}
          onDeleteAiHistory={role === "user" ? handleDeleteAiHistory : undefined}
        />
      </div>
    </main>
  );
}
