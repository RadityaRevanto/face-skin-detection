import { type ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeIcon, FieldIcon } from "./icons";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  ariaLabelShow?: string;
  ariaLabelHide?: string;
};

export function PasswordInput({
  id,
  name,
  placeholder,
  icon,
  required,
  minLength,
  disabled,
  className = "",
  autoComplete = "new-password",
  ariaLabelShow = "Show password",
  ariaLabelHide = "Hide password",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <FieldIcon>{icon}</FieldIcon>
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`h-12 rounded-xl border-zinc-200 bg-white pl-10 pr-10 text-sm shadow-sm focus-visible:ring-emerald-500 ${className}`}
        required={required}
        minLength={minLength}
        disabled={disabled}
      />
      <button
        type='button'
        aria-label={show ? ariaLabelShow : ariaLabelHide}
        onClick={() => setShow((v) => !v)}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60'
        disabled={disabled}
      >
        <EyeIcon hidden={show} />
      </button>
    </div>
  );
}
