"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";

type TagInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  maxItems?: number;
  maxItemLength?: number;
};

export function TagInput({
  id,
  name,
  label,
  placeholder = "Ketik lalu tekan Enter",
  tags,
  onTagsChange,
  required = false,
  disabled = false,
  maxItems = 20,
  maxItemLength = 255,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    if (tags.length >= maxItems) return;
    if (trimmed.length > maxItemLength) return;
    onTagsChange([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div
        className={[
          "flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-emerald-500",
          disabled ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              disabled={disabled}
              className="rounded-full p-0.5 text-emerald-500 transition hover:bg-emerald-100 hover:text-emerald-700"
              aria-label={`Hapus ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {tags.length < maxItems && (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (input.trim()) addTag(input);
            }}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="min-w-[120px] flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
        )}
      </div>

      <p className="text-xs text-zinc-400">
        {tags.length}/{maxItems} item
        {tags.length > 0 && (
          <span className="ml-2 text-zinc-400">
            · Tekan Enter untuk menambah, Backspace untuk menghapus
          </span>
        )}
      </p>

      {/* Hidden inputs for form submission */}
      {tags.map((tag, i) => (
        <input key={i} type="hidden" name={name} value={tag} />
      ))}
    </div>
  );
}
