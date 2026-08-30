"use client";

import { useState, useRef, useEffect } from "react";
import {
  getConversations, createConversation, getMessages, sendMessage,
  startAiConversation, deleteAiConversation, Conversation, Message,
} from "@/lib/api/consultations-query";
import { DoctorSearchModal } from "./DoctorSearchModal";
import { ScanHistoryModal } from "./ScanHistoryModal";
import { DoctorRatingModal } from "./DoctorRatingModal";
import { getEcho } from "@/lib/echo";
import { ScanHistory } from "@/lib/api/scans-query";
import { ErrorPopup } from "./ErrorPopup";
import { ConversationSidebar } from "@/src/features/consultation/components/ConversationSidebar";
import { ChatPanel } from "@/src/features/consultation/components/ChatPanel";
import { ErrorCta, buildApiError } from "../utils/consultationHelpers";

export function ConsultationContainer() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [inputText, setInputText] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isStartingAi, setIsStartingAi] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string; cta?: ErrorCta } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showApiError = (error: unknown) => setErrorState(buildApiError(error));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedImagePreview]);

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (!activeConversation) { setMessages([]); return; }
    fetchMessages(activeConversation.uuid);
    const echo = getEcho();
    if (!echo) return;
    const channelName = `conversation.${activeConversation.uuid}`;
    echo.private(channelName).listen('.chat_message_received', (e: any) => {
      if (!e.message) return;
      setMessages((prev) => prev.some(m => m.uuid === e.message.uuid) ? prev : [...prev, e.message]);
      setConversations((prev) => prev.map((c) => c.uuid === activeConversation.uuid ? { ...c, last_message: e.message } : c));
    });
    return () => { echo.leave(channelName); };
  }, [activeConversation]);

  const fetchConversations = async () => {
    try { const res = await getConversations(1); setConversations(res.data || []); }
    catch (error) { console.error(error); }
    finally { setIsLoadingConversations(false); }
  };

  const fetchMessages = async (conversationId: string) => {
    try { const res = await getMessages(conversationId, 1); setMessages([...(res.data || [])].reverse()); }
    catch (error) { console.error(error); }
  };

  const handleCreateOrOpenConversation = async (doctorId: string) => {
    setIsModalOpen(false);
    try {
      const res = await createConversation(doctorId);
      const newConversation = res.data;
      setConversations((prev) => prev.some((c) => c.uuid === newConversation.uuid) ? prev : [newConversation, ...prev]);
      setActiveConversation(newConversation);
      setShowSidebar(false);
    } catch (error) { showApiError(error); }
  };

  const handleStartAiChat = async () => {
    if (isStartingAi) return;
    setIsStartingAi(true);
    try {
      const res = await startAiConversation();
      const conv = res.data as Conversation;
      setConversations((prev) => prev.some((c) => c.uuid === conv.uuid) ? prev : [conv, ...prev]);
      setActiveConversation(conv);
      setShowSidebar(false);
    } catch (error) { showApiError(error); }
    finally { setIsStartingAi(false); }
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
    } catch (error) { showApiError(error); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedImageFile(file); setSelectedImagePreview(URL.createObjectURL(file)); }
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
      setConversations((prev) => prev.map((c) => c.uuid === activeConversation.uuid ? { ...c, last_message: res.data } : c));
      setInputText(""); setSelectedImageFile(null); setSelectedImagePreview(null);
    } catch (error) { showApiError(error); }
    finally { setIsSending(false); }
  };

  const handleSendScanHistory = async (scan: ScanHistory) => {
    setIsScanModalOpen(false);
    if (!activeConversation) return;
    setIsSending(true);
    try {
      const res = await sendMessage(activeConversation.uuid, { prediction_history_id: scan.uuid });
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) => prev.map((c) => c.uuid === activeConversation.uuid ? { ...c, last_message: res.data } : c));
    } catch (error) { showApiError(error); }
    finally { setIsSending(false); }
  };

  return (
    <main className="bg-shell flex flex-col h-screen overflow-hidden">
      <ErrorPopup errorState={errorState} setErrorState={setErrorState} successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
      <DoctorSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectDoctor={handleCreateOrOpenConversation} />
      <ScanHistoryModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} onSelectScan={handleSendScanHistory} />
      {activeConversation && (
        <DoctorRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)}
          doctorId={activeConversation.doctor?.uuid} doctorName={activeConversation.doctor?.full_name || "Dokter"}
          onSuccess={() => { setIsRatingModalOpen(false); setSuccessMsg("Terima kasih, ulasan Anda berhasil disimpan."); }} />
      )}
      <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col lg:flex-row lg:gap-6 lg:p-8 min-h-0">
        <ConversationSidebar conversations={conversations} activeConversation={activeConversation} showSidebar={showSidebar}
          isLoadingConversations={isLoadingConversations} isStartingAi={isStartingAi}
          setActiveConversation={setActiveConversation} setShowSidebar={setShowSidebar} setIsModalOpen={setIsModalOpen} handleStartAiChat={handleStartAiChat} />
        <ChatPanel activeConversation={activeConversation} messages={messages} showSidebar={showSidebar} inputText={inputText}
          selectedImagePreview={selectedImagePreview} isSending={isSending} setShowSidebar={setShowSidebar}
          setIsRatingModalOpen={setIsRatingModalOpen} setIsScanModalOpen={setIsScanModalOpen} handleSendMessage={handleSendMessage}
          handleImageUpload={handleImageUpload} setSelectedImageFile={setSelectedImageFile} setSelectedImagePreview={setSelectedImagePreview}
          setInputText={setInputText} handleDeleteAiHistory={handleDeleteAiHistory} fileInputRef={fileInputRef} messagesEndRef={messagesEndRef} />
      </div>
    </main>
  );
}
