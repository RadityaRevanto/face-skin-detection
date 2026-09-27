import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import type { PagePagination } from "@/lib/types/pagination";

import type { SkincareRow } from "../types";
import { DeleteSkincareButton } from "./DeleteSkincareButton";
import { SkincareActionIcon } from "./SkincareActionIcon";

type SkincareTableProps = {
  products: SkincareRow[];
  pagination: PagePagination;
};

export function SkincareTable({ products, pagination }: SkincareTableProps) {
  const renderActions = (product: SkincareRow) => (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={ROUTES.DOCTOR.SKINCARE_EDIT(product.id)}
        aria-label="Edit produk"
        title="Edit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-slate-400 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--role-accent-soft)] hover:text-[var(--role-accent-strong)]"
      >
        <SkincareActionIcon type="edit" />
      </Link>
      <DeleteSkincareButton productId={product.id} productName={product.name} />
    </div>
  );

  const tableNode = (
    <Table className="min-w-full divide-y divide-slate-100">
      <TableHeader className="bg-slate-50/80">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-14 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            No
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Produk
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Kategori
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Skin Concern
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Tipe Kulit
          </TableHead>
          <TableHead className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-slate-100 bg-white">
        {products.map((product) => (
          <TableRow
            key={product.id}
            className="group border-slate-100 transition-colors hover:bg-[var(--role-accent-soft)]/40"
          >
            <TableCell className="px-4 py-3.5 text-sm font-medium text-slate-500 tabular-nums">
              {product.no}
            </TableCell>

            <TableCell className="px-4 py-3.5">
              <div className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[var(--role-accent-strong)]">
                {product.name}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {product.keyIngredients} · Update {product.updatedAt}
              </div>
            </TableCell>

            <TableCell className="px-4 py-3.5">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {product.category}
              </span>
            </TableCell>

            <TableCell className="px-4 py-3.5 text-sm text-slate-500">
              {product.concern}
            </TableCell>

            <TableCell className="px-4 py-3.5 text-sm text-slate-500">
              {product.skinType}
            </TableCell>

            <TableCell className="px-4 py-3.5 text-right text-sm font-medium">
              {renderActions(product)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Mobile card list — identitas produk, kategori, concern/tipe, aksi.
  const cardsNode = (
    <div className="divide-y divide-slate-100 bg-white">
      {products.map((product) => (
        <div key={product.id} className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {product.name}
            </p>
            <p className="text-xs text-slate-500">
              {product.category} · {product.concern}
            </p>
            <p className="truncate text-xs text-slate-400">
              {product.keyIngredients}
            </p>
          </div>
          {renderActions(product)}
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={products.length > 0 ? cardsNode : undefined}
      empty={
        products.length === 0 ? (
          <EmptyState
            title="Belum ada produk skincare"
            description="Produk yang Anda buat akan muncul di sini dan bisa dipakai untuk rekomendasi pasien."
            action={
              <Link
                href={ROUTES.DOCTOR.SKINCARE_CREATE}
                className="inline-flex h-9 items-center rounded-[var(--radius-control)] bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-emerald-700"
              >
                Tambah Produk
              </Link>
            }
          />
        ) : undefined
      }
      footer={
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          itemLabel={pagination.itemLabel}
          basePath={pagination.basePath}
        />
      }
    />
  );
}