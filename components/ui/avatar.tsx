"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: "online" | "offline";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

const statusSizeClasses = {
  sm: "h-2.5 w-2.5 border-[1.5px]",
  md: "h-3 w-3 border-2",
  lg: "h-3.5 w-3.5 border-2",
} as const;

export function Avatar({
  src,
  name,
  size = "md",
  showStatus = false,
  status = "online",
  className,
  ...props
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div className={cn("relative shrink-0", className)} {...props}>
      {src ? (
        <div
          className={cn(
            "overflow-hidden rounded-full",
            sizeClasses[size]
          )}
        >
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-slate-900 font-bold text-white",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {showStatus ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            statusSizeClasses[size],
            status === "online" ? "bg-emerald-500" : "bg-slate-300"
          )}
        />
      ) : null}
    </div>
  );
}
