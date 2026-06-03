import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "success" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-zinc-950 text-white shadow hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200",
  success:
    "bg-emerald-600 text-white shadow hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600",
  outline:
    "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
  ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
