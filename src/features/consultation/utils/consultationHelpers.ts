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

export function buildApiError(error: unknown): { message: string; cta?: ErrorCta } {
  if (error instanceof ConsultationApiError) {
    let cta: ErrorCta | undefined;
    if (error.status === 402 || error.status === 429) {
      cta = "subscription";
    } else if (error.status === 403 && /ai|aura/i.test(error.message)) {
      cta = "consent";
    }
    return { message: error.message, cta };
  }
  return {
    message: error instanceof Error ? error.message : "Terjadi kesalahan.",
  };
}
