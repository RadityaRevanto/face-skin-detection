"use client";

import type { SkincareFormSelectProps } from "./SkincareFormTypes";

const selectClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export function SkincareFormSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: SkincareFormSelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className='mb-2 block text-sm font-semibold text-gray-700'
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
        {placeholder ? <option value=''>{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
