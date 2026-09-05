/**
 * Tipe bersama untuk semua response backend — bentuk konsisten
 * `{ data, meta }` (lihat app/Traits/ApiResponse.php di be-skincek).
 *
 * `meta` bervariasi per endpoint: message (flash), pagination (Laravel
 * paginator), atau object kosong. Gunakan `ApiEnvelope` untuk response
 * non-paginated, `PaginatedEnvelope` untuk list endpoint.
 */

export type ApiMeta = Record<string, unknown> | null;

/** Response sukses non-paginated: `{ data: T, meta }`. */
export type ApiEnvelope<T> = {
  data: T;
  meta?: ApiMeta;
};

/** Meta pagination Laravel paginator. */
export type PaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  path?: string;
  links?: unknown;
};

/** Response sukses paginated: `{ data: T[], meta: pagination }`. */
export type PaginatedEnvelope<T> = {
  data: T[];
  meta: PaginationMeta;
};

/** Nilai valid `?per_page=` backend (default 5). */
export const PER_PAGE_VALUES = [5, 10, 20, 50] as const;
export type PerPage = (typeof PER_PAGE_VALUES)[number];
export const DEFAULT_PER_PAGE: PerPage = 5;

/** Normalisasi input per_page menjadi nilai valid (default 5). */
export function normalizePerPage(value: number | undefined | null): PerPage {
  const n = Number(value);
  return (PER_PAGE_VALUES as readonly number[]).includes(n)
    ? (n as PerPage)
    : DEFAULT_PER_PAGE;
}

/** Bangun object params axios untuk pagination: `{ page, per_page }`. */
export function paginationParams(
  page: number,
  perPage?: number | null,
): { page: number; per_page: PerPage } {
  return { page, per_page: normalizePerPage(perPage) };
}
