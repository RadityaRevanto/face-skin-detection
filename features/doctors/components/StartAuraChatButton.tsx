"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { customToast } from "@/lib/custom-toast";
import { aiChatService } from "@/features/ai-chat/services/aiChatService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

type ConsentStatus = {
  accepted: boolean;
  version: string;
  text: string | null;
  accepted_at: string | null;
};

/**
 * Button "Chat dengan Aura" — alur khusus AI bot:
 * GET consent → (belum setuju → modal consent) → POST consent → POST
 * /ai-chat/conversations → masuk chat. Tanpa dialog konfirmasi dokter.
 */
export function StartAuraChatButton() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [consent, setConsent] = useState<ConsentStatus | null>(null);

  const enterChat = async () => {
    const response = await aiChatService.startConversation();

    const conversationUuid = response?.data?.uuid;
    if (!conversationUuid) {
      throw new Error("Gagal memulai chat Aura Skin");
    }

    router.push(`/user/chats?c=${conversationUuid}`);
  };

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const status = await aiChatService.getConsent();

      if (status.accepted) {
        await enterChat();
      } else {
        setConsent(status as ConsentStatus); // tampilkan modal consent
      }
    } catch (error: unknown) {
      customToast.error("Gagal", {
        description:
          (error instanceof Error && error.message
            ? getUserFriendlyErrorMessage(error)
            : "Gagal memulai chat Aura Skin"),
      });
    } finally {
      setIsStarting(false);
    }
  };

  const acceptConsent = async () => {
    setIsStarting(true);
    try {
      await aiChatService.updateConsent(true);
      await enterChat();
    } catch (error: unknown) {
      customToast.error("Gagal", {
        description:
          (error instanceof Error && error.message
            ? getUserFriendlyErrorMessage(error)
            : "Gagal menyimpan persetujuan AI"),
      });
    } finally {
      setIsStarting(false);
      setConsent(null);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={isStarting}
        onClick={handleStart}
        className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50"
      >
        {isStarting ? "Memproses..." : "Chat dengan Aura"}
      </button>

      {consent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900">
                Persetujuan Penggunaan AI
              </h3>
              <div className="mt-3 max-h-64 overflow-y-auto rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {consent.text ||
                  "Dengan menyetujui, kamu mengizinkan Skincek membagikan isi pesan chat ke penyedia AI agar Aura Skin dapat menjawab."}
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 p-6 pt-4">
              <button
                type="button"
                disabled={isStarting}
                onClick={() => setConsent(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isStarting}
                onClick={acceptConsent}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {isStarting ? "Memproses..." : "Setuju & Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
