import { fetchEnvelope, fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";

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

/** Response checkout: snap_token + redirect_url + subscription resource. */
export type CheckoutResult = {
  snap_token: string;
  redirect_url: string;
  subscription: SubscriptionReceipt;
};

export const subscriptionService = {
  /** GET /subscriptions — SubscriptionResource::collection paginated. */
  list: (page = 1, perPage?: number) =>
    fetchPaginated<Subscription>("/subscriptions", paginationParams(page, perPage)),

  /** POST /subscriptions/checkout — Midtrans Snap; 403 email belum verified. */
  checkout: (): Promise<ApiEnvelope<CheckoutResult>> =>
    mutate("post", "/subscriptions/checkout"),

  /** GET /subscriptions/{uuid}/receipt — resource dibungkus `data`; 404 jika tidak active. */
  receipt: (uuid: string): Promise<SubscriptionReceipt> =>
    fetchEnvelope<SubscriptionReceipt>(`/subscriptions/${uuid}/receipt`).then((r) => r.data),

  /** POST /subscriptions/{uuid}/cancel — hanya subscription ACTIVE. */
  cancel: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("post", `/subscriptions/${uuid}/cancel`),
};
