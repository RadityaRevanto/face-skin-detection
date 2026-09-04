"use client";

import { RefObject } from "react";
import { Send, CheckCheck, X } from "lucide-react";

type ChatInputProps = {
  inputText: string;
  selectedImagePreview: string | null;
  isSending: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  role: "user" | "doctor";
  onInputChange: (value: string) => void;
  onRemoveImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** User-only: buka modal scan history. */
  onOpenScanModal?: () => void;
};

export function ChatInput({
  inputText,
  selectedImagePreview,
  isSending,
  fileInputRef,
  role,
  onInputChange,
  onRemoveImage,
  onImageUpload,
  onSendMessage,
  onKeyDown,
  onOpenScanModal,
}: ChatInputProps) {
  return (
    <div className="p-3 sm:p-4 bg-chat-input border-t border-zinc-200 shrink-0">
      {selectedImagePreview && (
        <div className="mb-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 inline-block relative shadow-sm">
          <button
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 shadow-sm transition-colors"
          >
            <X size={14} />
          </button>
          <img
            src={selectedImagePreview}
            alt="Preview"
            className="h-20 sm:h-24 w-auto rounded-lg object-cover"
          />
        </div>
      )}

      <form onSubmit={onSendMessage} className="flex items-end gap-2">
        <div className="flex-1 bg-white border-none rounded-2xl flex items-end px-1 py-1 shadow-sm min-w-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-emerald-600 transition-colors shrink-0"
            title="Lampirkan Foto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onImageUpload}
          />

          {role === "user" && onOpenScanModal && (
            <button
              type="button"
              onClick={onOpenScanModal}
              className="p-2 sm:p-2.5 text-zinc-400 hover:text-emerald-600 transition-colors shrink-0"
              title="Lampirkan Hasil Scan"
            >
              <CheckCheck size={20} />
            </button>
          )}

          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={role === "doctor" ? "Tulis balasan medis..." : "Ketik pesan..."}
            className="flex-1 max-h-32 min-h-11 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm sm:text-[15px] text-zinc-800 placeholder-zinc-400"
            rows={1}
          />
        </div>

        <button
          type="submit"
          disabled={isSending || (!inputText.trim() && !selectedImagePreview)}
          className="bg-chat-accent hover:bg-chat-accent-hover disabled:bg-chat-accent/50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all shadow-sm shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Send size={18} className="ml-1 sm:w-5 sm:h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
