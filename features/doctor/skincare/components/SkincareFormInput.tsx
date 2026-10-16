"use client";

import type { SkincareFormInputProps } from "./SkincareFormTypes";

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export function SkincareFormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: SkincareFormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className='mb-2 block text-sm font-semibold text-slate-700'
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
