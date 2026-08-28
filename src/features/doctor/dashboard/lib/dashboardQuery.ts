import { fetchApi } from "@/lib/api/server-client";

type DashboardStats = {
  total_patients: number | null;
  conversations_awaiting_reply: number | null;
  my_products: number | null;
  my_recommendations: number | null;
  average_rating: number | null;
  total_ratings: number | null;
};

type ConversationLastMessage = {
  content: string | null;
  sender_role: string | null;
  created_at: string | null;
};

type DashboardConversation = {
  uuid: string;
  user: {
    uuid: string;
    full_name: string | null;
  } | null;
  message_count: number | null;
  last_message: ConversationLastMessage | null;
};

export type DashboardData = {
  verification_status: string | null;
  stats: DashboardStats;
  recent_conversations: DashboardConversation[];
};

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const res = await fetchApi<DashboardData>("/doctor/dashboard");
    return res.data ?? null;
  } catch (error) {
    console.error("Failed to fetch doctor dashboard:", error);
    return null;
  }
}
