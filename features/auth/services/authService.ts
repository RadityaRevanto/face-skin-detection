import { tokenStorage, type AuthUser } from "@/lib/api";
import { fetchEnvelope, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";

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

export type AuthData = {
  user: AuthUser;
  token: string;
};

/** Response auth: `{ data: { user, token }, meta }`. */
export type AuthResponse = ApiEnvelope<AuthData>;

/** Bentuk GET /profile (ProfileController::show) — lebih kaya dari login user. */
export type Profile = AuthUser & {
  role: "user" | "doctor" | "admin";
  profile_completed?: boolean;
  email_verified?: boolean;
  verification_status?: string;
  subscription_status?: "Pro" | "Free";
  scan_count?: number;
  user_messages_count?: number;
  remaining_free_messages?: number;
  product_count?: number;
  recommendation_count?: number;
  pending_doctor_verifications?: number;
};

export type ProfileResponse = ApiEnvelope<Profile>;

export type ForgotPasswordPayload = { email: string };

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
};

/** Simpan token + user ke localStorage (dipakai semua endpoint auth). */
function persistSession(envelope: AuthResponse) {
  if (envelope.data?.token) {
    tokenStorage.set(envelope.data.token, envelope.data.user);
  }
  return envelope;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> =>
    persistSession(await mutate("post", "/login", payload)),

  register: async (payload: RegisterPayload): Promise<AuthResponse> =>
    persistSession(await mutate("post", "/register", payload)),

  /** Multipart/form-data — FormData dibiarkan apa adanya (axios set boundary otomatis). */
  registerDoctor: async (formData: FormData): Promise<AuthResponse> =>
    persistSession(await mutate("post", "/register-doctor", formData)),

  google: async (idToken: string, privacyConsent = true): Promise<AuthResponse> =>
    persistSession(
      await mutate("post", "/auth/google", {
        id_token: idToken,
        privacy_consent: privacyConsent,
      }),
    ),

  /** GET /profile — refresh cache localStorage dengan data lengkap (role, dll). */
  me: async (): Promise<ProfileResponse> => {
    const envelope = await fetchEnvelope<Profile>("/profile");
    if (envelope.data) {
      tokenStorage.set(tokenStorage.get() ?? "", envelope.data);
    }
    return envelope;
  },

  logout: async (): Promise<void> => {
    try {
      await mutate("post", "/logout");
    } catch {
      // Token lokal tetap dibersihkan meskipun request gagal.
    } finally {
      tokenStorage.clear();
    }
  },

  logoutAll: async (): Promise<void> => {
    try {
      await mutate("post", "/logout-all");
    } catch {
      // Token lokal tetap dibersihkan meskipun request gagal.
    } finally {
      tokenStorage.clear();
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiEnvelope<null>> =>
    mutate("post", "/forgot-password", payload),

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiEnvelope<null>> =>
    mutate("post", "/reset-password", payload),

  sendEmailVerification: async (): Promise<ApiEnvelope<null>> =>
    mutate("post", "/email/verify/send"),

  verifyEmail: async (payload: { otp: string }): Promise<ApiEnvelope<null>> =>
    mutate("post", "/email/verify", payload),
};
