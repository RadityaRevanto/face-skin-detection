import { ApiError } from "./errors";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined | null>;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://be-skincek.test/api/v1";

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T; meta?: any }> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const isFormData = restOptions.body && typeof (restOptions.body as any).append === 'function';
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };
  
  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: await response.text() };
    }
    throw new ApiError(
      response.status,
      errorData?.message || `Request failed with status ${response.status}`,
      errorData
    );
  }

  if (response.status === 204) {
    return { data: {} as T };
  }

  return response.json();
}
