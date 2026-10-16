"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  getConversations,
  getMessages,
  sendMessage,
  ConsultationApiError,
  type Conversation,
  type Message,
} from "@/lib/api/consultations-query";
import { getEcho } from "@/lib/echo";
import type { DoctorConsultationFilter, DoctorConsultationKpi } from "../types";

export function useDoctorConsultations() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<DoctorConsultationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const res = await getConversations(1);
      const list = res.data || [];
      setConversations(list);
    } catch (err) {
      if (err instanceof ConsultationApiError && err.status === 0) return;
      setErrorMessage("Gagal memuat antrean konsultasi pasien.");
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await getMessages(conversationId, 1);
      setMessages([...(res.data || [])].reverse());
    } catch (err) {
      if (err instanceof ConsultationApiError && err.status === 0) return;
      setErrorMessage("Gagal memuat riwayat pesan.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const targetId = searchParams.get("c");
  useEffect(() => {
    if (!targetId || isLoadingConversations) return;
    const found = conversations.find((c) => c.uuid === targetId);
    if (found) {
      setActiveConversation(found);
      setShowSidebar(false);
    }
  }, [targetId, conversations, isLoadingConversations]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    fetchMessages(activeConversation.uuid);

    const echo = getEcho();
    if (!echo) return;
    const channelName = `conversation.${activeConversation.uuid}`;

    echo.private(channelName).listen(".message.sent", (e: { message?: Message }) => {
      if (!e.message) return;
      setMessages((prev) =>
        prev.some((m) => m.uuid === e.message!.uuid) ? prev : [...prev, e.message!]
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.uuid === activeConversation.uuid ? { ...c, last_message: e.message } : c
        )
      );
    });

    return () => {
      echo.leave(channelName);
    };
  }, [activeConversation, fetchMessages]);

  const handleSendMessage = useCallback(
    async (content: string, mediaFile: File | null) => {
      if (!activeConversation || (!content.trim() && !mediaFile)) return;
      setIsSending(true);
      try {
        let payload: FormData | { content?: string };
        if (mediaFile) {
          payload = new FormData();
          if (content.trim()) payload.append("content", content.trim());
          payload.append("media", mediaFile);
        } else {
          payload = { content: content.trim() };
        }
        const res = await sendMessage(activeConversation.uuid, payload);
        setMessages((prev) => [...prev, res.data]);
        setConversations((prev) =>
          prev.map((c) =>
            c.uuid === activeConversation.uuid ? { ...c, last_message: res.data } : c
          )
        );
      } catch (err) {
        if (err instanceof Error) setErrorMessage(err.message);
        else setErrorMessage("Gagal mengirim balasan.");
      } finally {
        setIsSending(false);
      }
    },
    [activeConversation]
  );

  const kpis: DoctorConsultationKpi = useMemo(() => {
    const total = conversations.length;
    let unread = 0;
    let done = 0;
    for (const c of conversations) {
      const lastMsg = c.last_message;
      if (!lastMsg || lastMsg.sender?.role === "user") unread += 1;
      else if (lastMsg.sender?.role === "doctor") done += 1;
    }
    return { total, unread, done };
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const userName = c.user?.full_name?.toLowerCase() || "";
        if (!userName.includes(q)) return false;
      }
      const lastMsg = c.last_message;
      if (activeTab === "unread") return !lastMsg || lastMsg.sender?.role === "user";
      if (activeTab === "done") return lastMsg && lastMsg.sender?.role === "doctor";
      return true;
    });
  }, [conversations, searchQuery, activeTab]);

  return {
    conversations,
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
    refreshConversations: fetchConversations,
    handleSendMessage,
  };
}
