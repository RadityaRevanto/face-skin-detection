"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Eye,
  FileText,
  Mail,
  ShieldAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { adminService } from "@/features/admin/services/adminService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

import { DoctorVerificationTabs } from "./DoctorVerificationTabs";
import type {
  DoctorVerificationPageData,
  DoctorVerificationRequest,
} from "../lib/doctorVerificationTypes";

type DecisionState = {
  doctor: DoctorVerificationRequest;
  type: "approve" | "reject";
} | null;

export function DoctorVerificationContent({
  pageType,
  verificationRequests,
  stats,
  pagination,
}: DoctorVerificationPageData) {
  const isPendingPage = pageType === "pending";

  return (
    <div className="w-full space-y-5">
      <PageHeader
        eyebrow="Verifikasi Profesi"
        title={isPendingPage ? "Menunggu Review" : "Riwayat Ditolak"}
        description={
          isPendingPage
            ? "Periksa identitas dan dokumen STR dokter sebelum memberi akses dashboard."
            : "Pengajuan yang ditolak beserta alasan penolakannya."
        }
      />

      <DoctorVerificationTabs
        pageType={pageType}
        pendingCount={stats.pendingCount}
        rejectedCount={stats.rejectedCount}
      />

      {verificationRequests.length === 0 ? (
        <EmptyVerifications pending={isPendingPage} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {verificationRequests.map((doctor) => (
              <VerificationCard key={doctor.id} doctor={doctor} pageType={pageType} />
            ))}
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              itemLabel={pagination.itemLabel}
              basePath={pagination.basePath}
            />
          </div>
        </>
      )}
    </div>
  );
}

function EmptyVerifications({ pending }: { pending: boolean }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-14 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--ink-muted)]">
        <ShieldAlert className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--ink-soft)]">
        {pending ? "Antrean verifikasi sedang kosong" : "Belum ada pengajuan yang ditolak"}
      </p>
      <p className="mt-1 text-xs text-[var(--ink-muted)]">
        {pending
          ? "Semua pengajuan dokter sudah diproses. Pengajuan baru akan muncul di sini."
          : "Pengajuan yang ditolak akan tercatat di sini beserta alasannya."}
      </p>
    </div>
  );
}

function VerificationCard({
  doctor,
  pageType,
}: {
  doctor: DoctorVerificationRequest;
  pageType: "pending" | "rejected";
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<DecisionState>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [busy, setBusy] = useState(false);

  const isPending = pageType === "pending";
  const href = `/admin/doctor-verifications/detail?id=${encodeURIComponent(doctor.id)}`;

  async function submitDecision() {
    if (!decision) return;
    const isReject = decision.type === "reject";
    if (isReject && !rejectNote.trim()) {
      customToast.warning("Alasan penolakan wajib diisi.");
      return;
    }

    setBusy(true);
    try {
      await adminService.reviewVerification(
        decision.doctor.id,
        isReject ? "rejected" : "approved",
        isReject ? rejectNote.trim() : undefined,
      );
      customToast.success(isReject ? "Verifikasi ditolak" : "Verifikasi disetujui", {
        description: "Keputusan tersimpan dan dokter sudah diberi notifikasi.",
      });
      setDecision(null);
      setRejectNote("");
      queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-verifications-count"] });
      router.refresh();
    } catch (error) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="animate-rise flex flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-shadow duration-[var(--motion-base)] hover:shadow-[var(--shadow-card-hover)]">
      {/* Identitas personal — fokus utama kartu */}
      <div className="flex items-start gap-4 p-5">
        <UserAvatar
          name={doctor.name}
          src={doctor.avatarUrl}
          size="md"
          className="!h-14 !w-14 !text-base"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="min-w-0 truncate font-heading text-base font-bold text-[var(--ink)]">
              {doctor.name}
            </h3>
            <StatusBadge
              status={isPending ? "Menunggu" : "Ditolak"}
              variant={isPending ? "pending" : "rejected"}
            />
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--ink-muted)]">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {doctor.email}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ink-soft)]">
              {doctor.specialization}
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              STR {doctor.identity}
            </span>
          </div>
        </div>
      </div>

      {/* Dokumen & waktu */}
      <div className="border-t border-[var(--line)] px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--ink-muted)]">
            Diajukan <span className="font-medium text-[var(--ink-soft)]">{doctor.submittedAt}</span>
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {doctor.documents.length > 0 ? (
              doctor.documents.slice(0, 2).map((doc) => (
                <a
                  key={doc.uuid}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-40 items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface-2)]/60 px-2 py-1 text-[11px] font-semibold text-[var(--ink-soft)] transition-colors hover:border-[var(--role-accent)]/50 hover:text-[var(--role-accent-strong)]"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{doc.file_name ?? "Dokumen"}</span>
                </a>
              ))
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--warning-fg)]">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Tanpa dokumen
              </span>
            )}
            {doctor.documents.length > 2 ? (
              <span className="text-[11px] text-[var(--ink-muted)]">
                +{doctor.documents.length - 2} lagi
              </span>
            ) : null}
          </div>
        </div>

        {!isPending && doctor.rejectionReason ? (
          <p className="mt-2 rounded-[var(--radius-control)] bg-[var(--destructive-bg)] px-3 py-2 text-xs leading-5 text-[var(--destructive-fg)]">
            <span className="font-semibold">Alasan:</span> {doctor.rejectionReason}
          </p>
        ) : null}
      </div>

      {/* Aksi — jelas & tidak ambigu */}
      <div className="mt-auto flex flex-col gap-2 border-t border-[var(--line)] p-4 sm:flex-row sm:items-center">
        {isPending ? (
          <>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push(href)}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Tinjau Detail
            </Button>
            <div className="grid flex-1 grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => setDecision({ doctor, type: "approve" })}
                className="bg-[var(--success-bg)] text-[var(--success-fg)] shadow-none hover:bg-[var(--success-fg)]/15"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Approve
              </Button>
              <Button
                type="button"
                onClick={() => setDecision({ doctor, type: "reject" })}
                className="bg-[var(--destructive-bg)] text-[var(--destructive-fg)] shadow-none hover:bg-[var(--destructive-fg)]/15"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Reject
              </Button>
            </div>
          </>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => router.push(href)}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Lihat Riwayat Pengajuan
          </Button>
        )}
      </div>

      {/* Approve: konfirmasi ringkas; Reject: alasan wajib */}
      <ConfirmDialog
        open={decision?.type === "approve"}
        title={`Setujui verifikasi ${decision?.doctor.name ?? ""}?`}
        description="Dokter akan langsung mendapat akses dashboard dan notifikasi email."
        confirmLabel="Ya, Approve"
        tone="primary"
        loading={busy}
        onConfirm={submitDecision}
        onCancel={() => setDecision(null)}
      />

      <Modal
        open={decision?.type === "reject"}
        onClose={() => {
          if (!busy) setDecision(null);
        }}
        title={`Tolak pengajuan ${decision?.doctor.name ?? ""}?`}
        description="Alasan wajib diisi — dokter melihat pesan ini di halaman status verifikasinya."
        size="sm"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={busy} onClick={() => setDecision(null)}>
              Batal
            </Button>
            <Button variant="danger" disabled={busy} onClick={submitDecision}>
              {busy ? "Memproses..." : "Tolak Pengajuan"}
            </Button>
          </div>
        }
      >
        <label htmlFor="reject-reason" className="mb-1.5 block text-sm font-medium text-[var(--ink-soft)]">
          Alasan penolakan
        </label>
        <textarea
          id="reject-reason"
          rows={4}
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          placeholder="Contoh: Dokumen STR tidak terbaca jelas atau tidak sesuai identitas."
          className={cn(
            "w-full resize-none rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface-2)]/60 px-3 py-2.5 text-sm leading-6 text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-muted)] focus:border-[var(--role-accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--role-accent-soft)]",
          )}
        />
      </Modal>
    </article>
  );
}