import { cn } from "@/lib/utils";

/**
 * Skeleton shadcn/ui — blok pulse generik. SELALU dibungkus komponen
 * skeleton shape-matched (mis. `HistoryCardSkeleton`) yang meniru layout
 * komponen data aslinya, bukan dipakai langsung acak di halaman.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-slate-200/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
