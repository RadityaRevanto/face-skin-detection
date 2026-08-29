"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  OctagonXIcon,
  TriangleAlertIcon,
  InfoIcon,
  X,
  LucideIcon,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────

interface ToastTypeStyle {
  label: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  progressGradient: string;
  glowShadow: string;
}

const TOAST_STYLES: Record<string, ToastTypeStyle> = {
  success: {
    label: "Berhasil",
    Icon: CircleCheckIcon,
    iconColor: "text-emerald-600",
    iconBg:
      "bg-emerald-50 border border-emerald-200/80 shadow-sm shadow-emerald-500/10",
    borderColor: "border-emerald-200/90 hover:border-emerald-300/90",
    progressGradient: "from-emerald-500 via-teal-400 to-emerald-400",
    glowShadow: "shadow-[0_10px_30px_-5px_rgba(16,185,129,0.15)]",
  },
  error: {
    label: "Gagal",
    Icon: OctagonXIcon,
    iconColor: "text-rose-600",
    iconBg:
      "bg-rose-50 border border-rose-200/80 shadow-sm shadow-rose-500/10",
    borderColor: "border-rose-200/90 hover:border-rose-300/90",
    progressGradient: "from-rose-500 via-red-400 to-rose-400",
    glowShadow: "shadow-[0_10px_30px_-5px_rgba(244,63,94,0.15)]",
  },
  warning: {
    label: "Peringatan",
    Icon: TriangleAlertIcon,
    iconColor: "text-amber-600",
    iconBg:
      "bg-amber-50 border border-amber-200/80 shadow-sm shadow-amber-500/10",
    borderColor: "border-amber-200/90 hover:border-amber-300/90",
    progressGradient: "from-amber-500 via-orange-400 to-amber-400",
    glowShadow: "shadow-[0_10px_30px_-5px_rgba(245,158,11,0.15)]",
  },
  info: {
    label: "Informasi",
    Icon: InfoIcon,
    iconColor: "text-sky-600",
    iconBg:
      "bg-sky-50 border border-sky-200/80 shadow-sm shadow-sky-500/10",
    borderColor: "border-sky-200/90 hover:border-sky-300/90",
    progressGradient: "from-sky-500 via-blue-500 to-indigo-500",
    glowShadow: "shadow-[0_10px_30px_-5px_rgba(14,165,233,0.15)]",
  },
};

// ─── Toast Render Component ──────────────────────────────────────────────

const DEFAULT_DURATION = 5000;

interface CustomToastCardProps {
  toastId: string | number;
  type: string;
  title: string;
  description?: string;
  duration: number;
}

function CustomToastCard({
  toastId,
  type,
  title,
  description,
  duration,
}: CustomToastCardProps) {
  const style = TOAST_STYLES[type] ?? TOAST_STYLES.info;
  const { Icon } = style;

  return (
    <div
      className={cn(
        "group relative flex w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border bg-white p-4 pr-10 shadow-xl transition-all duration-300",
        style.borderColor,
        style.glowShadow
      )}
    >
      {/* Icon + Text */}
      <div className="flex items-start gap-3.5 flex-1">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            style.iconBg,
            style.iconColor
          )}
        >
          <Icon size={20} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h4 className="text-[13px] font-bold leading-snug text-slate-900">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Tutup"
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(toastId);
        }}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 hover:rotate-90 active:scale-90"
      >
        <X size={14} />
      </button>

      {/* Progress Bar — countdown berkurang ke kiri */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/80 overflow-hidden rounded-b-2xl">
        <div
          onAnimationEnd={() => toast.dismiss(toastId)}
          className={cn(
            "h-full toast-progress bg-gradient-to-r",
            style.progressGradient
          )}
          style={{
            animation: `shrinkProgress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Public API ──────────────────────────────────────────────────────────

interface ShowToastOptions {
  description?: string;
  duration?: number;
  id?: string;
}

function show(
  type: string,
  title: string,
  opts?: ShowToastOptions | string
) {
  const resolved: ShowToastOptions =
    typeof opts === "string" ? { description: opts } : opts ?? {};

  const duration = resolved.duration ?? DEFAULT_DURATION;

  return toast.custom(
    (id) => (
      <CustomToastCard
        toastId={id}
        type={type}
        title={title}
        description={resolved.description}
        duration={duration}
      />
    ),
    {
      id: resolved.id,
      position: "top-right",
      duration: duration + 400,
    }
  );
}

/**
 * Drop-in replacement untuk `toast.success / error / warning / info` dari Sonner
 * dengan desain premium + progress bar countdown.
 *
 * @example
 * ```ts
 * import { customToast } from "@/lib/custom-toast";
 *
 * customToast.success("Berhasil disimpan", { description: "Data telah tersimpan." });
 * customToast.error("Gagal", "Terjadi kesalahan.");
 * ```
 */
export const customToast = {
  success: (title: string, opts?: ShowToastOptions | string) =>
    show("success", title, opts),
  error: (title: string, opts?: ShowToastOptions | string) =>
    show("error", title, opts),
  warning: (title: string, opts?: ShowToastOptions | string) =>
    show("warning", title, opts),
  info: (title: string, opts?: ShowToastOptions | string) =>
    show("info", title, opts),
};
