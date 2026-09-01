import { api } from "@/lib/api";

import type { Subscription as SubscriptionItem } from "@/features/user/components/types";

export type Subscription = SubscriptionItem;

export type SubscriptionReceipt = {
  plan_code: string;
  period?: string;
  amount: number;
  currency?: string;
  payment_method?: string | null;
  midtrans_order_id?: string | null;
  starts_at: string | null;
  ends_at: string | null;
  paid_at: string | null;
  [key: string]: unknown;
};

export const subscriptionService = {
  list: async () => {
    const response = await api.get("/subscriptions");
    return response.data as { data: Subscription[]; meta?: unknown };
  },

  checkout: async () => {
    const response = await api.post("/subscriptions/checkout");
    return response.data;
  },

  receipt: async (uuid: string): Promise<SubscriptionReceipt> => {
    const response = await api.get(`/subscriptions/${uuid}/receipt`);
    return response.data.data;
  },

  cancel: async (uuid: string) => {
    const response = await api.post(`/subscriptions/${uuid}/cancel`);
    return response.data;
  },
};
