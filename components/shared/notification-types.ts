export type NotificationData = {
  id: string;
  title?: string;
  body?: string;
  read_at: string | null;
  created_at: string;
  data?: {
    title?: string;
    body?: string;
    conversation_id?: string;
  };
};

export interface NotificationBellProps {
  userId?: number | string | null;
  userUuid?: string | null;
}
