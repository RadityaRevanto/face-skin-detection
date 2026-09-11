import {
  Droplet,
  Droplets,
  FlaskConical,
  ListChecks,
  Package,
  Sun,
  TriangleAlert,
  User,
  Waves,
  type LucideIcon,
} from "lucide-react";

import type {
  SkincareRecommendation,
  TreatmentRecommendation,
} from "@/features/scan/services/scanService";

/** Icon per kategori produk (lowercase match). */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  serum: FlaskConical,
  moisturizer: Droplets,
  cleanser: Waves,
  sunscreen: Sun,
  toner: Droplet,
  cream: Droplets,
};

function doctorInitial(name: string): string {
  return name.replace(/^dr\.?\s*/i, "").charAt(0).toUpperCase() || "D";
}

/** Badge icon kategori — pemilihan icon diisolasi di sini (bukan saat render card). */
function CategoryIconBadge({ category }: { category?: string | null }) {
  const Icon = CATEGORY_ICONS[(category ?? "").toLowerCase()] ?? Package;
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
      <Icon className="h-5 w-5" />
    </span>
  );
}

/** Baris info kecil berlabel — struktur visual, bukan teks polos. */
function ProductInfoRow({
  icon: Icon,
  label,
  text,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

/**
 * 🧴 Kartu produk skincare — bagian "Rekomendasi Skincare (Produk)" hasil scan.
 * Desain mengikuti bahasa kartu Rekomendasi Perawatan: icon kategori, chips
 * meta, baris info berlabel, callout warning, footer atribusi dokter.
 * Data embedded dari response scan (skincare_recommendations).
 */
export function SkincareProductCard({ product }: { product: SkincareRecommendation }) {
  const metaChips = [
    (product.category ?? "").trim() ? product.category!.charAt(0).toUpperCase() + product.category!.slice(1) : "",
    product.skin_type,
    product.gender,
  ].filter(Boolean);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header: icon kategori + nama + chips meta */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <CategoryIconBadge category={product.category} />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black leading-5 text-slate-900">
            {product.name}
          </h4>
          {metaChips.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {metaChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Body: info berlabel */}
      <div className="flex-1 space-y-3 px-4">
        {product.key_ingredients ? (
          <ProductInfoRow icon={FlaskConical} label="Kandungan" text={product.key_ingredients} />
        ) : null}
        {product.usage_instruction ? (
          <ProductInfoRow icon={ListChecks} label="Cara Pakai" text={product.usage_instruction} />
        ) : null}
      </div>

      {/* Warning callout */}
      {product.warning ? (
        <div className="mx-4 mt-3 flex gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="text-xs font-semibold leading-5 text-amber-800">
            {product.warning}
          </p>
        </div>
      ) : null}

      {/* Footer: atribusi dokter */}
      {product.doctor ? (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
            {doctorInitial(product.doctor)}
          </span>
          <p className="min-w-0 truncate text-xs font-medium text-slate-500">
            Direkomendasikan oleh{" "}
            <span className="font-bold text-slate-700">{product.doctor}</span>
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500">
            <User className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-medium text-slate-500">Kurasi tim SkinCek</p>
        </div>
      )}
    </article>
  );
}

/**
 * 💡 Item tips perawatan — bagian "Rekomendasi Perawatan (Tips)" hasil scan.
 * Backend sudah mengurutkan high → medium → low.
 */
const PRIORITY_STYLES: Record<TreatmentRecommendation["priority_level"], string> = {
  high: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
};

const PRIORITY_LABELS: Record<TreatmentRecommendation["priority_level"], string> = {
  high: "Prioritas Tinggi",
  medium: "Prioritas Sedang",
  low: "Prioritas Ringan",
};

export function TreatmentTipItem({ tip }: { tip: TreatmentRecommendation }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-white shadow-sm">
      <div className="flex items-start gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold leading-5 text-slate-900">
              {tip.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${PRIORITY_STYLES[tip.priority_level] ?? PRIORITY_STYLES.low}`}
            >
              {PRIORITY_LABELS[tip.priority_level] ?? "Prioritas Ringan"}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            {tip.recommendation_text}
          </p>
        </div>
      </div>
    </article>
  );
}
