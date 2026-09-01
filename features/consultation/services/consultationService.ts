import { api } from "@/lib/api";
import type { PagePagination } from "@/lib/types/pagination";

export type ConversationSummary = {
  uuid: string;
  doctor?: { uuid?: string; full_name?: string; avatar_url?: string | null };
  user?: { uuid?: string; full_name?: string; avatar_url?: string | null };
  last_message?: string | null;
  last_message_at?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

export type ChatMessage = {
  uuid: string;
  sender_type?: "user" | "doctor";
  message?: string | null;
  media_url?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

export const consultationService = {
  conversations: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/conversations", { params });
    return response.data as {
      data: ConversationSummary[];
      meta: PagePagination & { total: number };
    };
  },

  start: async (doctorUuid: string) => {
    const response = await api.post("/conversations", {
      doctor_id: doctorUuid,
    });
    return response.data;
  },

  messages: async (conversationId: string, params?: { page?: number; per_page?: number }) => {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params,
    });
    return response.data as {
      data: ChatMessage[];
      meta: PagePagination & { total: number };
    };
  },

  send: async (conversationId: string, payload: { message?: string; media?: File | Blob }) => {
    const isFile = payload.media instanceof File || payload.media instanceof Blob;
    const body = isFile
      ? (() => {
          const fd = new FormData();
          if (payload.message) fd.append("message", payload.message);
          if (payload.media) fd.append("media", payload.media, "attachment");
          return fd;
        })()
      : { message: payload.message };

    const response = await api.post(`/conversations/${conversationId}/messages`, body);
    return response.data;
  },
};
