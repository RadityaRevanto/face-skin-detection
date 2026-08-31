import { TriangleAlertIcon } from "lucide-react";

/**
 * Banner info `notice` dari response scan — hanya dirender jika terisi
 * (backend mengisi ketika confidence < 50%).
 */
export function ScanNoticeBanner({ notice }: { notice?: string | null }) {
  if (!notice) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <TriangleAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-amber-800">
          Perhatian
        </p>
        <p className="mt-1 text-sm font-medium leading-6 text-amber-700">
          {notice}
        </p>
      </div>
    </div>
  );
}
