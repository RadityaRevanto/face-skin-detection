/**
 * Response handler terpusat — semua service WAJIB lewat helper ini agar
 * bentuk `{ data, meta }` backend (app/Traits/ApiResponse.php) di-unwrap
 * secara konsisten, tidak parsing manual per-service.
 *
 * - `fetchEnvelope`  → response non-paginated, return `{ data, meta }` utuh.
 * - `fetchPaginated` → response list, return `{ data: T[], meta: PaginationMeta }`.
 * - `mutate`         → POST/PATCH/DELETE, return `{ data, meta }` (data bisa null).
 *
 * Error tetap dilempar sebagai AxiosError agar interceptor 401 di lib/api.ts
 * berjalan dan `lib/api-errors.ts` bisa memetakan pesan user-friendly.
 */

import { api } from "@/lib/api";
import type { ApiEnvelope, PaginationMeta } from "./envelope";
import type { AxiosRequestConfig } from "axios";

export async function fetchEnvelope<T, M = ApiEnvelope<T>["meta"]>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<{ data: T; meta?: M }> {
  const response = await api.get<{ data: T; meta?: M }>(url, config);
  return response.data;
}

export async function fetchPaginated<T, M = PaginationMeta>(
  url: string,
  params?: Record<string, unknown>,
): Promise<{ data: T[]; meta: M }> {
  const response = await api.get<{ data: T[]; meta: M }>(url, { params });
  return response.data;
}

export async function mutate<T>(
  method: "post" | "patch" | "delete",
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiEnvelope<T>> {
  const response = await api[method]<ApiEnvelope<T>>(url, payload, config);
  return response.data;
}
