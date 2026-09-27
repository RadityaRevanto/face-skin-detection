import { Eye, Pencil, PowerOff, Power, ShieldCheck, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PagePagination } from "@/lib/types/pagination";

import type { DoctorRow } from "@/features/admin/doctors/lib/doctorsTypes";

type DoctorsTableProps = {
  doctors: DoctorRow[];
  pagination: PagePagination;
  onEdit: (row: DoctorRow) => void;
  onToggleActive: (row: DoctorRow) => void;
  onDelete: (row: DoctorRow) => void;
  busyId: string | null;
};

/**
 * Penanda verifikasi — doctor di halaman ini sudah pasti lulus review,
 * jadi cukup inline check (gaya "akun terverifikasi"), bukan pill status.
 */
function VerifiedMark() {
  return (
    <span
      title="Verifikasi disetujui admin"
      className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--success-fg)]"
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Terverifikasi
    </span>
  );
}

function buildActions(
  doctor: DoctorRow,
  handlers: Pick<DoctorsTableProps, "onEdit" | "onToggleActive" | "onDelete">,
) {
  return {
    primary: {
      key: "view",
      label: "Lihat detail",
      icon: <Eye className="h-4 w-4" />,
      href: `/admin/doctors/detail?id=${encodeURIComponent(doctor.id)}`,
    },
    actions: [
      {
        key: "edit",
        label: "Edit akun",
        icon: <Pencil className="h-4 w-4" />,
        onSelect: () => handlers.onEdit(doctor),
      },
      {
        key: "toggle",
        label: doctor.isActive ? "Suspend" : "Aktifkan",
        tone: (doctor.isActive ? "warning" : "success") as "warning" | "success",
        icon: doctor.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
        onSelect: () => handlers.onToggleActive(doctor),
      },
      {
        key: "delete",
        label: "Hapus",
        tone: "danger" as const,
        icon: <Trash2 className="h-4 w-4" />,
        onSelect: () => handlers.onDelete(doctor),
      },
    ],
  };
}

export function DoctorsTable({
  doctors,
  pagination,
  onEdit,
  onToggleActive,
  onDelete,
  busyId,
}: DoctorsTableProps) {
  const handlers = { onEdit, onToggleActive, onDelete };

  const paginationNode = (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      pageSize={pagination.pageSize}
      itemLabel={pagination.itemLabel}
      basePath={pagination.basePath}
    />
  );

  const tableNode = (
    <Table className="min-w-full divide-y divide-[var(--line)]">
      <TableHeader className="bg-[var(--surface-2)]/70">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-14 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6">
            No
          </TableHead>

          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            Dokter
          </TableHead>

          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            STR / Identitas
          </TableHead>

          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            Spesialisasi
          </TableHead>

          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            Terverifikasi
          </TableHead>

          <TableHead className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-[var(--line)] bg-[var(--surface)]">
        {doctors.map((doctor) => (
          <TableRow
            key={doctor.id}
            className="group transition-colors hover:bg-[var(--role-accent-soft)]/50"
          >
            <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--ink-muted)] tabular-nums sm:px-6">
              {doctor.no}
            </TableCell>

            <TableCell className="px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={doctor.name}
                  src={doctor.avatarUrl}
                  status={doctor.isActive ? "active" : "inactive"}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="max-w-56 truncate text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--role-accent-strong)]">
                      {doctor.name}
                    </p>
                    <VerifiedMark />
                  </div>
                  <p className="truncate text-xs text-[var(--ink-muted)]">
                    {doctor.email}
                    {!doctor.isActive ? (
                      <span className="font-semibold text-[var(--warning-fg)]"> · Nonaktif</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-3 sm:px-6 lg:px-8">
              <span className="font-mono text-xs font-medium text-[var(--ink-soft)]">
                {doctor.identity}
              </span>
            </TableCell>

            <TableCell className="px-4 py-3 sm:px-6 lg:px-8">
              <span className="inline-flex max-w-48 items-center rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink-soft)]">
                <span className="truncate">{doctor.specialization}</span>
              </span>
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-[var(--ink-soft)] tabular-nums sm:px-6 lg:px-8">
              {doctor.verifiedAt}
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-3 text-right sm:px-6 lg:px-8">
              <TableRowActions
                {...buildActions(doctor, handlers)}
                busy={busyId === doctor.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const cardsNode = (
    <div className="divide-y divide-[var(--line)] bg-[var(--surface)]">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="flex items-start gap-3 p-4">
          <UserAvatar
            name={doctor.name}
            src={doctor.avatarUrl}
            status={doctor.isActive ? "active" : "inactive"}
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-bold text-[var(--ink)]">
              {doctor.name}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <VerifiedMark />
              <span className="truncate text-xs text-[var(--ink-muted)]">
                {doctor.specialization}
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--ink-muted)]">
              STR: {doctor.identity}
            </p>
            <p className="text-xs text-[var(--ink-muted)]">
              Diverifikasi: {doctor.verifiedAt}
              {!doctor.isActive ? (
                <span className="font-semibold text-[var(--warning-fg)]"> · Nonaktif</span>
              ) : null}
            </p>
          </div>

          <TableRowActions
            {...buildActions(doctor, handlers)}
            busy={busyId === doctor.id}
          />
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={doctors.length > 0 ? cardsNode : undefined}
      empty={
        doctors.length === 0 ? (
          <EmptyState
            title="Belum ada dokter terverifikasi"
            description="Dokter yang lulus verifikasi akan tampil di sini."
          />
        ) : undefined
      }
      footer={paginationNode}
    />
  );
}