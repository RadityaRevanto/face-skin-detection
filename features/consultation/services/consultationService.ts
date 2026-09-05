import { fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope, PaginationMeta } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";

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

/** ConversationResource::collection + paginator — meta pagination BE. */
export type ConversationsPage = {
  data: ConversationSummary[];
  meta: PaginationMeta & { total: number };
};

export const consultationService = {
  /** GET /conversations — list percakapan (user atau doctor). */
  conversations: (page = 1, perPage?: number): Promise<ConversationsPage> =>
    fetchPaginated<ConversationSummary, ConversationsPage["meta"]>(
      "/conversations",
      paginationParams(page, perPage),
    ),

  /** POST /conversations — mulai chat dengan dokter (body: doctor_id uuid). */
  start: (doctorUuid: string): Promise<ApiEnvelope<ConversationSummary>> =>
    mutate("post", "/conversations", { doctor_id: doctorUuid }),

  /** GET /conversations/{id}/messages — paginated, urut terbaru. */
  messages: (conversationId: string, page = 1, perPage?: number) =>
    fetchPaginated<ChatMessage, ConversationsPage["meta"]>(
      `/conversations/${conversationId}/messages`,
      paginationParams(page, perPage),
    ),

  /**
   * POST /conversations/{id}/messages — multipart saat ada media.
   * Field BE: `content` | `media` (file) | `prediction_history_id`.
   */
  send: (
    conversationId: string,
    payload: {
      message?: string;
      media?: File | Blob;
      prediction_history_id?: string;
    },
  ) => {
    const hasFile = payload.media instanceof File || payload.media instanceof Blob;
    const body: FormData | Record<string, unknown> = hasFile
      ? (() => {
          const fd = new FormData();
          if (payload.message) fd.append("content", payload.message);
          if (payload.media) fd.append("media", payload.media, "attachment");
          if (payload.prediction_history_id)
            fd.append("prediction_history_id", payload.prediction_history_id);
          return fd;
        })()
      : (() => {
          const obj: Record<string, unknown> = {};
          if (payload.message) obj.content = payload.message;
          if (payload.prediction_history_id)
            obj.prediction_history_id = payload.prediction_history_id;
          return obj;
        })();

    return mutate("post", `/conversations/${conversationId}/messages`, body);
  },
};
