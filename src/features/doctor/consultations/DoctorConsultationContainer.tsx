"use client";

import { useState, useRef, useEffect } from "react";
import {
  getConversations,
  getMessages,
  sendMessage,
  Conversation,
  Message,
} from "@/lib/api/consultations-query";
import { getEcho } from "@/lib/echo";
import { ErrorModal } from "./components/ErrorModal";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { ChatPanel } from "./components/ChatPanel";

export function DoctorConsultationContainer() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [inputText, setInputText] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedImagePreview]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.uuid);

      const echo = getEcho();
      if (echo) {
        const channelName = `conversation.${activeConversation.uuid}`;

        echo.private(channelName).listen(".chat_message_received", (e: any) => {
          if (e.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.uuid === e.message.uuid)) return prev;
              return [...prev, e.message];
            });

            setConversations((prev) =>
              prev.map((c) => {
                if (c.uuid === activeConversation.uuid) {
                  return { ...c, last_message: e.message };
                }
                return c;
              })
            );
          }
        });

        return () => {
          echo.leave(channelName);
        };
      }
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const res = await getConversations(1);
      setConversations(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await getMessages(conversationId, 1);
      const sortedMessages = [...(res.data || [])].reverse();
      setMessages(sortedMessages);
    } catch (error) {
      console.error(error);
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
    if (!activeConversation) return;
    if (!inputText.trim() && !selectedImageFile) return;

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
        prev.map((c) => {
          if (c.uuid === activeConversation.uuid) {
            return { ...c, last_message: res.data };
          }
          return c;
        })
      );

      setInputText("");
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
    } catch (error: any) {
      setErrorMsg(error.message);
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

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden relative">
      {errorMsg && (
        <ErrorModal
          errorMsg={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
      )}

      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-200/60">
        <ConversationSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          searchQuery={searchQuery}
          isLoadingConversations={isLoadingConversations}
          showSidebar={showSidebar}
          onSearchChange={setSearchQuery}
          onSelectConversation={(conv) => {
            setActiveConversation(conv);
            setShowSidebar(false);
          }}
        />

        <ChatPanel
          activeConversation={activeConversation}
          messages={messages}
          showSidebar={showSidebar}
          selectedImagePreview={selectedImagePreview}
          inputText={inputText}
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
        />
      </div>
    </div>
  );
}
