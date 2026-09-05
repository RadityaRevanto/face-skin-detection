import axios from "axios";

export const TOKEN_KEY = "skincek_token";
export const USER_KEY = "skincek_user_profile";

export type AuthUser = {
  uuid: string;
  full_name: string;
  email: string;
  role: "user" | "doctor" | "admin";
  avatar_url?: string | null;
  google_avatar_url?: string | null;
  is_active?: boolean;
  verification_status?: string;
  email_verified_at?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
};

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token === "undefined" || token === "null") return null;

    return token;
  },

  getUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem(USER_KEY);
    if (!user || user === "undefined" || user === "null") return null;

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  },

  set: (token: string, user?: unknown) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_KEY, token);

    if (user !== undefined) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (currentPath !== "/login") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  },
);
