import { type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { FieldIcon } from "./icons";

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
      />
    </div>
  );
}
