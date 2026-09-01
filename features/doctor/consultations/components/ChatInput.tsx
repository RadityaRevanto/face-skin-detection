"use client";

import { RefObject } from "react";
import { Send, Paperclip, Image as ImageIcon, X } from "lucide-react";

export function ChatInput({
  inputText,
  selectedImagePreview,
  isSending,
  fileInputRef,
  onInputChange,
  onRemoveImage,
  onImageUpload,
  onSendMessage,
  onKeyDown,
}: {
  inputText: string;
  selectedImagePreview: string | null;
  isSending: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onRemoveImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="p-2 sm:p-4 bg-chat-input border-t border-zinc-200">
      {selectedImagePreview && (
        <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-zinc-50 rounded-xl border border-zinc-200 inline-block relative shadow-sm">
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
        <div className="flex-1 bg-white border-none rounded-2xl flex items-end px-1 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onImageUpload}
          />

          <button
            type="button"
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 hidden sm:block"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tulis balasan medis..."
            className="flex-1 max-h-32 min-h-10 sm:min-h-11 bg-transparent border-none focus:ring-0 resize-none py-2.5 sm:py-3 px-2 text-sm sm:text-[15px] text-zinc-800 placeholder-zinc-400"
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={isSending || (!inputText.trim() && !selectedImagePreview)}
          className="bg-chat-accent hover:bg-chat-accent-hover disabled:bg-chat-accent/50 disabled:cursor-not-allowed text-white p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
          ) : (
            <Send size={18} className="ml-0.5 sm:ml-1" />
          )}
        </button>
      </form>
    </div>
  );
}
