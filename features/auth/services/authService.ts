import { api, tokenStorage, type AuthUser } from "@/lib/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  privacy_consent: boolean;
};

export type AuthResponse = {
  data: {
    user: AuthUser;
    token: string;
  };
  meta?: Record<string, unknown> | null;
};

export type ProfileResponse = {
  data: AuthUser;
  meta?: Record<string, unknown> | null;
};

export type ForgotPasswordPayload = { email: string };

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
};

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/login", payload);

    if (response.data?.data?.token) {
      tokenStorage.set(response.data.data.token, response.data.data.user);
    }

    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/register", payload);

    if (response.data?.data?.token) {
      tokenStorage.set(response.data.data.token, response.data.data.user);
    }

    return response.data;
  },

  registerDoctor: async (formData: FormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/register-doctor",
      formData,
    );

    if (response.data?.data?.token) {
      tokenStorage.set(response.data.data.token, response.data.data.user);
    }

    return response.data;
  },

  google: async (idToken: string, privacyConsent = true): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/google", {
      id_token: idToken,
      privacy_consent: privacyConsent,
    });

    if (response.data?.data?.token) {
      tokenStorage.set(response.data.data.token, response.data.data.user);
    }

    return response.data;
  },

  me: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/profile");
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/logout");
    } catch {
      // Token lokal tetap dibersihkan meskipun request gagal.
    } finally {
      tokenStorage.clear();
    }
  },

  logoutAll: async (): Promise<void> => {
    try {
      await api.post("/logout-all");
    } catch {
      // Token lokal tetap dibersihkan meskipun request gagal.
    } finally {
      tokenStorage.clear();
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const response = await api.post("/forgot-password", payload);
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await api.post("/reset-password", payload);
    return response.data;
  },

  sendEmailVerification: async () => {
    const response = await api.post("/email/verify/send");
    return response.data;
  },

  verifyEmail: async (payload: { otp: string }) => {
    const response = await api.post("/email/verify", payload);
    return response.data;
  },
};
