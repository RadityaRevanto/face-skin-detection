import { api } from "@/lib/api";

export type AiConsent = {
  accepted: boolean;
  version?: string;
  text?: string;
  [key: string]: unknown;
};

export type AiConversation = {
  uuid: string;
  title?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

export const aiChatService = {
  getConsent: async (): Promise<AiConsent> => {
    const response = await api.get("/ai-chat/consent");
    return response.data.data;
  },

  updateConsent: async (accepted: boolean) => {
    const response = await api.post("/ai-chat/consent", { accepted });
    return response.data;
  },

  startConversation: async () => {
    const response = await api.post("/ai-chat/conversations");
    return response.data;
  },

  destroyConversation: async (conversationId: string) => {
    const response = await api.delete(`/ai-chat/conversations/${conversationId}`);
    return response.data;
  },
};
