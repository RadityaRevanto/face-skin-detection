"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster global (shadcn/ui style) — border & warna toast dipetakan ke
 * kelas tema existing (emerald = sukses, rose = error, sky = info,
 * amber = warning, slate = netral) tanpa mem-override aksesibilitas
 * bawaan Sonner (ARIA live region, role, focus management tetap utuh).
 */
const toastClassNames = {
  success: "!border-emerald-200 !bg-emerald-50 !text-emerald-900",
  error: "!border-rose-200 !bg-rose-50 !text-rose-900",
  info: "!border-sky-200 !bg-sky-50 !text-sky-900",
  warning: "!border-amber-200 !bg-amber-50 !text-amber-900",
  default: "!border-slate-200 !bg-white !text-slate-900",
} as const;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      theme="system"
      className="toaster group"
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...toastClassNames,
          ...props.toastOptions?.classNames,
        },
        style: {
          fontFamily: "var(--font-poppins), Arial, Helvetica, sans-serif",
          ...props.toastOptions?.style,
        },
      }}
      style={
        {
          /**
           * Toaster wajib tampil di atas seluruh elemen shell (sidebar
           * sticky z-40, header sticky z-40, modal z-50) dari refactor
           * layout sebelumnya. Sonner membaca --z-index dari root style.
           */
          "--normal-border": "var(--border)",
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--z-index": "9999",
          ...props.style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { toast } from "sonner";
