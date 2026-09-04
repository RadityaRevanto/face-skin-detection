import { fetchEnvelope, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";

export type AiConsent = {
  accepted: boolean;
  version: string;
  text: string;
  accepted_at: string | null;
};

export type AiConversation = {
  uuid: string;
  title?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

export const aiChatService = {
  getConsent: async (): Promise<AiConsent> => {
    const envelope = await fetchEnvelope<AiConsent>("/ai-chat/consent");
    return envelope.data;
  },

  /** Response: `{ data: {accepted}, meta: {message} }`. */
  updateConsent: (accepted: boolean): Promise<ApiEnvelope<{ accepted: boolean }>> =>
    mutate("post", "/ai-chat/consent", { accepted }),

  /** 403 jika belum consent — FE handle via error handler. */
  startConversation: (): Promise<ApiEnvelope<AiConversation>> =>
    mutate("post", "/ai-chat/conversations"),

  destroyConversation: (conversationId: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/ai-chat/conversations/${conversationId}`),
};
