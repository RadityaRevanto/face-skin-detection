import type { SkincareProduct } from "../types";
import {
  SKINCARE_CATEGORY_LABELS,
  SKINCARE_CATEGORY_COLORS,
} from "../types";

type SkincareProductCardProps = {
  product: SkincareProduct;
};

export function SkincareProductCard({ product }: SkincareProductCardProps) {
  const categoryColor =
    SKINCARE_CATEGORY_COLORS[
      product.category as keyof typeof SKINCARE_CATEGORY_COLORS
    ] ?? "bg-slate-100 text-slate-700";
  const categoryLabel =
    SKINCARE_CATEGORY_LABELS[
      product.category as keyof typeof SKINCARE_CATEGORY_LABELS
    ] ?? product.category;

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${categoryColor}`}
        >
          {categoryLabel}
        </span>
        {!product.is_active && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            Inactive
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
        {product.name}
      </h3>

      {product.key_ingredients && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-600">Ingredients:</span>{" "}
          {product.key_ingredients}
        </p>
      )}

      {product.usage_instruction && (
        <div className="mt-3 rounded-xl bg-emerald-50/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Cara Pakai
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {product.usage_instruction}
          </p>
        </div>
      )}

      {product.warning && (
        <div className="mt-3 rounded-xl bg-amber-50 p-3">
          <p className="text-xs leading-relaxed text-amber-700">
            ⚠️ {product.warning}
          </p>
        </div>
      )}
    </div>
  );
}
