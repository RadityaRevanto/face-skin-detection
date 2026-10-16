"use client";

import Link from "next/link";
import { FlaskConical, Pencil, Layers } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import type { PagePagination } from "@/lib/types/pagination";

import type { SkincareRow } from "../types";
import { DeleteSkincareButton } from "./DeleteSkincareButton";

export type SkincareTableProps = {
  products: SkincareRow[];
  pagination: PagePagination;
};

export function SkincareTable({ products, pagination }: SkincareTableProps) {
  return (
    <div className="bg-surface rounded-xl shadow-xs border border-border/50 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-ink-muted font-eyebrow text-eyebrow uppercase tracking-wider h-12">
              <th className="px-space-lg py-3">Nama Produk &amp; Formula</th>
              <th className="px-space-md py-3">Kategori</th>
              <th className="px-space-md py-3">Gender</th>
              <th className="px-space-md py-3">Target Concern</th>
              <th className="px-space-md py-3">Tipe Kulit</th>
              <th className="px-space-md py-3">Status</th>
              <th className="px-space-lg py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-space-lg py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink-subtle">
                      <Layers className="w-6 h-6" />
                    </div>
                    <p className="font-headline-sm text-headline-sm text-ink font-semibold">
                      Belum Ada Produk Skincare
                    </p>
                    <p className="font-body-default text-caption text-ink-muted max-w-sm">
                      Daftarkan produk formulasi pertama Anda untuk dihubungkan ke sistem inferensi rekomendasi AI.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="h-14 bg-surface hover:bg-surface-alt transition-colors group"
                >
                  {/* Nama Produk & Formula */}
                  <td className="px-space-lg py-3">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-role-accent-doctor shrink-0 font-headline-sm">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 max-w-xs">
                        <span className="font-headline-sm text-body-default text-ink truncate font-semibold">
                          {product.name}
                        </span>
                        <span className="font-caption text-[11px] text-ink-subtle truncate">
                          {product.keyIngredients !== "-"
                            ? product.keyIngredients
                            : `ID: ${product.id.slice(0, 8)}`}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-space-md py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-caption text-caption bg-surface-container-low text-ink font-medium capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="px-space-md py-3">
                    <span className="font-caption text-caption text-ink font-medium capitalize">
                      {product.gender || "Unisex"}
                    </span>
                  </td>

                  {/* Target Concern */}
                  <td className="px-space-md py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-caption text-caption bg-amber-500/10 text-warning font-medium">
                      {product.concern}
                    </span>
                  </td>

                  {/* Tipe Kulit */}
                  <td className="px-space-md py-3 font-caption text-caption text-ink-muted">
                    {product.skinType}
                  </td>

                  {/* Status */}
                  <td className="px-space-md py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-caption text-caption font-semibold ${
                        product.isActive !== false
                          ? "bg-success/10 text-success"
                          : "bg-surface-container-high text-ink-subtle"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.isActive !== false ? "bg-success" : "bg-ink-subtle"
                        }`}
                      />
                      {product.isActive !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-space-lg py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={ROUTES.DOCTOR.SKINCARE_EDIT(product.id)}
                        className="p-2 rounded-lg text-ink-subtle hover:text-role-accent-doctor hover:bg-surface-container-low transition-colors"
                        title="Edit Formula"
                        aria-label="Edit Formula"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteSkincareButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-border/40 bg-surface">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            itemLabel={pagination.itemLabel}
            basePath={pagination.basePath}
          />
        </div>
      )}
    </div>
  );
}
