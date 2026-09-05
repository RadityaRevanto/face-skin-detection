import { ConsultationApiError, Conversation } from "@/lib/api/consultations-query";

export const AI_BOT_EMAIL = "aura@skincek.com";

export type ErrorCta = "subscription" | "consent";

export function isAiBotConversation(conv: Conversation): boolean {
  return (
    conv.doctor?.email === AI_BOT_EMAIL ||
    conv.doctor?.full_name === "Aura Skin"
  );
}

export function isCurrentUser(senderRole: string) {
  return senderRole === "user";
}

export function formatTime(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Deteksi error 403 "harus consent AI dulu" (dari /ai-chat/* atau kirim pesan). */
export function isConsentRequiredError(error: unknown): boolean {
  return (
    error instanceof ConsultationApiError &&
    error.status === 403 &&
    /penggunaan AI|aura skin|consent/i.test(error.message)
  );
}

export function buildApiError(error: unknown): { message: string; cta?: ErrorCta } {
  if (error instanceof ConsultationApiError) {
    let cta: ErrorCta | undefined;
    if (error.status === 402 || error.status === 429) {
      cta = "subscription";
    } else if (
      error.status === 403 &&
      // Spesifik: hindari false-positive dari kata "email" (mengandung "ai").
      // Pesan consent BE: "Setujui penggunaan AI terlebih dahulu..."
      /penggunaan AI|aura skin|consent/i.test(error.message)
    ) {
      cta = "consent";
    }
    return { message: error.message, cta };
  }

  // Axios error mentah (tidak lewat guard) — ambil message BE bila ada.
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosLike = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const beMessage = axiosLike.response?.data?.message;
    if (beMessage) {
      return {
        message: beMessage,
        cta: axiosLike.response?.status === 403 && /penggunaan AI|aura skin|consent/i.test(beMessage)
          ? "consent"
          : undefined,
      };
    }
    if (axiosLike.message) return { message: axiosLike.message };
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  // Unknown — log untuk debugging, jangan tampilkan teks polos.
  console.error("[consultation] unclassified error:", error);
  return { message: "Terjadi kesalahan tak terduga. Silakan coba lagi." };
}
