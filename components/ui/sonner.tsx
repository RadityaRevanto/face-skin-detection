"use client";

import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster global — dipakai bareng customToast (lib/custom-toast.tsx)
 * yang rendering via toast.custom(). Icons di sini sebagai fallback
 * untuk toast non-custom (mis. sonner bawaan).
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      theme="system"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          toast: "cn-toast",
          ...props.toastOptions?.classNames,
        },
        style: {
          fontFamily: "var(--font-poppins), Arial, Helvetica, sans-serif",
          ...props.toastOptions?.style,
        },
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1e293b",
          "--normal-border": "#e2e8f0",
          "--z-index": "9999",
          ...props.style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { toast } from "sonner";
