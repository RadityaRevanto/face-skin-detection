export type Subscription = {
  uuid: string;
  plan_code: string;
  period?: string;
  status: string;
  amount: number;
  currency?: string;
  payment_method?: string | null;
  midtrans_order_id?: string | null;
  starts_at: string | null;
  ends_at: string | null;
  paid_at: string | null;
  created_at: string;
};

export type ReceiptData = {
  plan_code: string;
  period?: string;
  amount: number;
  currency?: string;
  payment_method?: string | null;
  midtrans_order_id?: string | null;
  starts_at: string | null;
  ends_at: string | null;
  paid_at: string | null;
};
