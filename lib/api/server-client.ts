import "server-only";
import { fetchApi as baseFetchApi } from "./client";
import { getAuthToken } from "../auth/token";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined | null>;
};

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T; meta?: any }> {
  const token = await getAuthToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return baseFetchApi<T>(endpoint, {
    ...options,
    headers: Object.fromEntries(headers.entries()),
  });
}
