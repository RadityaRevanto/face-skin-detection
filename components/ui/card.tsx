import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "interactive" | "accent-top";

/**
 * Card — primitif kartu konsisten (Command Center).
 * - `interactive`: hover-elevation (dipakai kartu yang bisa diklik / link).
 * - `accent-top`: strip atas memakai `--role-accent` (penanda halaman/role).
 */
export function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: CardVariant }) {
  return (
    <div
      data-card-variant={variant}
      className={cn(
        "relative rounded-[var(--radius-card)] border bg-[var(--surface)] text-[var(--ink)]",
        variant === "default" && "border-[var(--line)] shadow-[var(--shadow-card)]",
        variant === "interactive" &&
          "border-[var(--line)] shadow-[var(--shadow-card)] transition-all duration-[var(--motion-base)] ease-out hover:-translate-y-0.5 hover:border-[var(--role-accent)] hover:shadow-[var(--shadow-card-hover)]",
        variant === "accent-top" &&
          "border-[var(--line)] pt-2.5 shadow-[var(--shadow-card)] before:absolute before:inset-x-3 before:top-0 before:h-0.5 before:rounded-full before:bg-[var(--role-accent)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 border-b border-[var(--line)] px-5 py-4", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-heading text-base font-semibold tracking-tight text-[var(--ink)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs text-[var(--ink-muted)]", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center border-t border-[var(--line)] px-5 py-3", className)}
      {...props}
    />
  );
}