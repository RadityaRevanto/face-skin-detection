import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger"
  | "accent";
type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-semibold transition-all duration-[var(--motion-fast)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--role-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:scale-[.98] cursor-pointer";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--cta)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--cta-hover)]",
  // "default" dipertahankan sebagai alias primary — pemakaian lama (auth/form) tetap aman.
  default:
    "bg-[var(--cta)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--cta-hover)]",
  success:
    "bg-[var(--cta)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--cta-hover)]",
  secondary:
    "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] shadow-sm hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
  outline:
    "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] shadow-sm hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
  ghost: "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
  danger: "bg-[var(--destructive-strong)] text-white shadow-sm hover:bg-[var(--destructive-fg)]",
  accent: "bg-[var(--role-accent)] text-white shadow-sm hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-6",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}