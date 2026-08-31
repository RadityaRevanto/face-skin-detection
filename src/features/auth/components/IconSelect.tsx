import { type ReactNode, type ChangeEvent } from "react";
import { FieldIcon } from "./Icons";

type IconSelectProps = {
  id: string;
  name: string;
  icon: ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

const ChevronDown = () => (
  <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400'>
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m6 9 6 6 6-6'
      />
    </svg>
  </span>
);

export function IconSelect({
  id,
  name,
  icon,
  className = "flex h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm text-zinc-950 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60",
  required,
  disabled,
  defaultValue = "",
  value,
  onChange,
  children,
}: IconSelectProps) {
  return (
    <div className='relative'>
      <FieldIcon>{icon}</FieldIcon>
      <select
        id={id}
        name={name}
        className={className}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {children}
      </select>
      <ChevronDown />
    </div>
  );
}
