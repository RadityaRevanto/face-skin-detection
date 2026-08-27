"use client";

import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import {
  getConversations, createConversation, getMessages, sendMessage,
  startAiConversation, deleteAiConversation, Conversation, Message,
} from "@/lib/api/consultations-query";
import { DoctorSearchModal } from "./_components/doctor-search-modal";
import { ScanHistoryModal } from "./_components/scan-history-modal";
import { DoctorRatingModal } from "./_components/doctor-rating-modal";
import { getEcho } from "@/lib/echo";
import { ScanHistory } from "@/lib/api/scans-query";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { ErrorPopup } from "./_components/error-popup";
import { ConversationSidebar } from "./_components/conversation-sidebar";
import { ChatPanel } from "./_components/chat-panel";
import { ErrorCta, buildApiError } from "./_components/consultation-utils";

export default function UserConsultationsPage() {
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const showApiError = (error: unknown) => setErrorState(buildApiError(error));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedImagePreview]);

  useEffect(() => { fetchConversations(); fetchProfileData(); }, []);

  const fetchProfileData = async () => {
    try { const res = await getProfile(); setUserProfile(res.data); }
    catch (error) { console.error("Failed to fetch profile", error); }
  };

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
    <main className={`bg-[#f7fbf8] p-4 sm:p-6 lg:px-8 lg:pt-4 lg:pb-8 flex flex-col ${showSidebar ? 'min-h-[calc(100vh-72px)] h-auto lg:h-[calc(100vh-72px)]' : 'h-[calc(100vh-72px)]'}`}>
      <ErrorPopup errorState={errorState} setErrorState={setErrorState} successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
      <DoctorSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectDoctor={handleCreateOrOpenConversation} />
      <ScanHistoryModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} onSelectScan={handleSendScanHistory} />
      {activeConversation && (
        <DoctorRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)}
          doctorId={activeConversation.doctor?.uuid} doctorName={activeConversation.doctor?.full_name || "Dokter"}
          onSuccess={() => { setIsRatingModalOpen(false); setSuccessMsg("Terima kasih, ulasan Anda berhasil disimpan."); }} />
      )}
      
      {/* Header Consultation (Title + Quota Box) */}
      <div className={`mx-auto w-full max-w-350 shrink-0 flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 ${showSidebar ? 'flex' : 'hidden lg:flex'}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Konsultasi Medis</h1>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base leading-relaxed">Tanya jawab langsung dengan dokter spesialis kami mengenai hasil skin check Anda.</p>
        </div>

        <div className="flex flex-row items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-900/5 shrink-0 min-w-fit">
          {userProfile?.subscription_status === "Pro" ? (
            <>
              <div className="flex -space-x-2">
                <span className="w-10 h-10 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-600 font-bold text-sm z-20">
                  <Star size={18} fill="currentColor" />
                </span>
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
      </div>

      <div className={`mx-auto w-full max-w-350 flex-1 flex flex-col lg:flex-row gap-6 min-h-0`}>
        <ConversationSidebar conversations={conversations} activeConversation={activeConversation} showSidebar={showSidebar}
          isLoadingConversations={isLoadingConversations} isStartingAi={isStartingAi} userProfile={userProfile}
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
