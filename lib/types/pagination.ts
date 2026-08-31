/**
 * Bentuk pagination yang dikonsumsi komponen <Pagination>.
 * `basePath` wajib untuk halaman server (Link mode) — tombol render <a href="?page=N">.
 * Tanpa basePath, tabel client harus pakai callback onPageChange.
 */
export type PagePagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  basePath: string;
  itemLabel?: string;
};
