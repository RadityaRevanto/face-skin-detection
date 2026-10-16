import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

/**
 * UserAvatar — inisial di tile rounded penuh dengan warna surface-3.
 * Foto eksternal (R2/Google) lewat <img> (next/image perlu konfigurasi domain dinamis).
 * `status` → dot indikator kecil di pojok (hijau aktif / amber nonaktif).
 */
export function UserAvatar({
  name,
  src,
  size = "md",
  status,
  className,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  status?: "active" | "inactive";
  className?: string;
}) {
  const sizeCls = size === "sm" ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm";

  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center overflow-hidden rounded-full bg-[var(--surface-3)] font-bold uppercase text-[var(--ink-soft)]",
          sizeCls,
          className,
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar URL eksternal (R2/Google) dinamis
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          getInitials(name) || "?"
        )}
      </span>
      {status ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--surface)]",
            status === "active" ? "bg-[var(--success-fg)]" : "bg-[var(--warning-fg)]",
          )}
        />
      ) : null}
    </span>
  );
}