"use client";

import type { SkincareFormTextareaProps } from "./SkincareFormTypes";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export function SkincareFormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: SkincareFormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className='mb-2 block text-sm font-semibold text-slate-700'
      >
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={textareaClass}
      />
    </div>
  );
}
