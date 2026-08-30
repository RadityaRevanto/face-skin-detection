import { type ReactNode, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { FieldIcon } from "./Icons";

type IconInputProps = {
  id: string;
  name: string;
  icon: ReactNode;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

export function IconInput({
  id,
  name,
  icon,
  placeholder,
  type = "text",
  autoComplete,
  className = "h-11 rounded-xl pl-10 focus-visible:ring-emerald-500",
  required,
  disabled,
  value,
  onChange,
  min,
  max,
}: IconInputProps) {
  return (
    <div className='relative'>
      <FieldIcon>{icon}</FieldIcon>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={className}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
    </div>
  );
}
