"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  Check, 
  CheckCheck, 
  Clock,
  MoreVertical,
  Info,
  Search,
  ChevronLeft
} from "lucide-react";
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  Conversation, 
  Message 
} from "@/lib/api/consultations-query";
import { formatGender } from "@/lib/utils/demographics";
import { getEcho } from "@/lib/echo";

export default function DoctorConsultationsPage() {
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [inputText, setInputText] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll ke bawah saat pesan baru muncul
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedImagePreview]);

  // Fetch initial conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Polling messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.uuid);
      
      const echo = getEcho();
      if (echo) {
        const channelName = `conversation.${activeConversation.uuid}`;
        
        echo.private(channelName)
          .listen('.chat_message_received', (e: any) => {
            if (e.message) {
              setMessages((prev) => {
                // Prevent duplicate messages if we also just sent one locally
                if (prev.some(m => m.uuid === e.message.uuid)) return prev;
                return [...prev, e.message];
              });
              
              // Update last message in the sidebar
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

  const fetchMessages = async (conversationId: string, silent = false) => {
    try {
      const res = await getMessages(conversationId, 1);
      // API returns newest first (latest), so we need to reverse it for chat UI
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
      
      // Add message locally to feel fast
      setMessages((prev) => [...prev, res.data]);
      
      // Update last message in conversation list
      setConversations((prev) => prev.map((c) => {
        if (c.uuid === activeConversation.uuid) {
          return { ...c, last_message: res.data };
        }
        return c;
      }));

      setInputText("");
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUser = (senderRole: string) => {
    return senderRole === "doctor";
  };

  const filteredConversations = conversations.filter(c => 
    c.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden relative">
      
      {/* Error Popup */}
      {errorMsg && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center gap-3">
              <div className="bg-rose-100 text-rose-600 p-2 rounded-full">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-rose-800 text-base">Pemberitahuan</h3>
            </div>
            <div className="p-5">
              <p className="text-zinc-600 text-sm leading-relaxed">{errorMsg}</p>
            </div>
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button 
                onClick={() => setErrorMsg(null)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-200/60">
        
        {/* Sidebar Daftar Pasien */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 border-r border-zinc-100 flex-col`}>
          <div className="p-5 border-b border-zinc-100">
            <h2 className="font-semibold text-zinc-800 text-lg">Pesan Masuk</h2>
            <div className="mt-4 relative">
              <input 
                type="text" 
                placeholder="Cari pasien..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg">Semua</button>
              <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 text-xs font-medium rounded-lg transition-colors">Belum Dibaca</button>
              <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 text-xs font-medium rounded-lg transition-colors">Selesai</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center p-8 text-zinc-500 text-sm">
                Belum ada pesan masuk
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.uuid === conv.uuid;
                return (
                  <div 
                    key={conv.uuid}
                    onClick={() => {
                      setActiveConversation(conv);
                      setShowSidebar(false);
                    }}
                    className={`p-4 border-b border-zinc-50 cursor-pointer transition-all hover:bg-zinc-50 flex flex-col gap-2 ${isActive ? 'bg-emerald-50/50 relative' : ''}`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                    )}
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src={conv.user.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(conv.user.full_name) + "&background=10b981&color=fff"} 
                        alt={conv.user.full_name} 
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-semibold text-zinc-900 truncate text-sm">{conv.user.full_name}</h3>
                          {conv.last_message && (
                            <span className="text-[10px] text-zinc-400 shrink-0">
                              {formatTime(conv.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs truncate text-zinc-500">
                            {conv.last_message ? (
                              conv.last_message.type === 'image' ? '📷 Foto' : 
                              conv.last_message.type === 'scan_result' ? '📋 Hasil Scan' : 
                              conv.last_message.content
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
          </div>
        </div>

        {/* Area Chat Utama */}
        <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-zinc-50/30`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-18 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button 
                    onClick={() => setShowSidebar(true)} 
                    className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-emerald-600 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <img 
                    src={activeConversation.user.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(activeConversation.user.full_name) + "&background=10b981&color=fff"} 
                    alt={activeConversation.user.full_name} 
                    className="w-11 h-11 rounded-full object-cover" 
                  />
                  <div>
                    <h2 className="font-semibold text-zinc-900 text-sm">{activeConversation.user.full_name}</h2>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      {activeConversation.user.age !== undefined && activeConversation.user.age !== null && (
                        <>
                          <span>{activeConversation.user.age} thn</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        </>
                      )}
                      <span>{formatGender(activeConversation.user.gender)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors"><Info size={20} /></button>
                  <button className="p-2 hover:bg-zinc-100 rounded-full hover:text-zinc-600 transition-colors"><MoreVertical size={20} /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#efeae2]">
                <div className="flex justify-center mb-6 mt-2">
                  <div className="bg-[#ffeecd] text-zinc-600 text-xs py-1.5 px-3 rounded-lg shadow-sm font-medium inline-flex items-center gap-1.5">
                    <Clock size={12} />
                    Sesi Konsultasi Dimulai
                  </div>
                </div>

                {messages.map((message, index) => {
                  const isDoctor = isCurrentUser(message.sender.role);
                  const isFirstInGroup = index === 0 || messages[index - 1].sender.uuid !== message.sender.uuid;

                  return (
                    <div key={message.uuid} className={`flex ${isDoctor ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-3" : "mt-1"}`}>
                      <div className={`relative max-w-[85%] md:max-w-[70%] px-2.5 py-1.5 shadow-sm ${
                        isDoctor 
                          ? "bg-[#d9fdd3] text-[#111b21] rounded-lg rounded-tr-none" 
                          : "bg-white text-[#111b21] rounded-lg rounded-tl-none"
                      }`}>
                        
                        {message.type === 'image' && message.media_url && (
                          <div className="mb-1 relative overflow-hidden rounded-md">
                            <img 
                              src={message.media_url} 
                              alt="Uploaded content" 
                              className="max-w-full sm:max-w-70 max-h-75 object-cover"
                            />
                          </div>
                        )}

                        {message.type === 'scan_result' && (
                          <div className="mb-2 w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-sm mt-1">
                            <div className="bg-[#00a884] text-white px-3 py-1.5 flex items-center gap-2">
                              <CheckCheck size={16} />
                              <span className="font-semibold text-xs tracking-wide">LAPORAN SCAN KULIT PASIEN</span>
                            </div>
                            <div className="p-3 pb-1 text-sm text-zinc-700 leading-relaxed border-b border-zinc-100">
                              {message.content}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-end gap-x-2 gap-y-0.5">
                          {message.content && (
                            <p className="text-[14.5px] leading-snug wrap-break-word">
                              {message.content}
                              {/* Invisible placeholder for timestamp to wrap text correctly */}
                              <span className="inline-block w-15" aria-hidden="true"></span>
                            </p>
                          )}
                          
                          <div className="flex items-center gap-1 shrink-0 ml-auto absolute bottom-1.5 right-2">
                            <span className="text-[10px] text-zinc-500 leading-none">{formatTime(message.created_at)}</span>
                            {isDoctor && (
                              <span className="text-zinc-400">
                                <Check size={14} strokeWidth={2.5} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Chat Input Area */}
              <div className="p-3 sm:p-4 bg-[#f0f2f5] border-t border-zinc-200">
                {/* Image Preview Area */}
                {selectedImagePreview && (
                  <div className="mb-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 inline-block relative shadow-sm">
                    <button 
                      onClick={() => {
                        setSelectedImageFile(null);
                        setSelectedImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 shadow-sm transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <img src={selectedImagePreview} alt="Preview" className="h-24 w-auto rounded-lg object-cover" />
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <div className="flex-1 bg-white border-none rounded-2xl flex items-end px-1 py-1 shadow-sm">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                    >
                      <ImageIcon size={22} />
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    
                    <button type="button" className="p-2.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 hidden sm:block">
                      <Paperclip size={20} />
                    </button>

                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Tulis balasan medis..." 
                      className="flex-1 max-h-32 min-h-11 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-[15px] text-zinc-800 placeholder-zinc-400"
                      rows={1}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSending || (!inputText.trim() && !selectedImageFile)}
                    className="bg-[#00a884] hover:bg-[#008f6f] disabled:bg-[#00a884]/50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all shadow-sm shrink-0 flex items-center justify-center w-12 h-12"
                  >
                    {isSending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <Send size={20} className="ml-1" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <Send size={32} className="text-zinc-300 ml-1" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-2">Pilih antrean konsultasi pasien</h3>
              <p className="text-sm max-w-sm">Anda dapat membalas keluhan, memberikan rekomendasi skincare, atau menghentikan sesi konsultasi jika sudah selesai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
