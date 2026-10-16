"use client";

import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Eye,
  AlertCircle,
  XCircle,
  FileEdit,
} from "lucide-react";
import type {
  DoctorVerificationPageType,
  DoctorVerificationRequest,
} from "../lib/doctorVerificationTypes";

type VerificationTableRowProps = {
  request: DoctorVerificationRequest;
  activeTab: DoctorVerificationPageType;
};

export function VerificationTableRow({
  request,
  activeTab,
}: VerificationTableRowProps) {
  const initials = request.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const idCode = `MED-2026-${request.id.slice(0, 4).toUpperCase()}`;

  const renderStatusBadge = () => {
    switch (activeTab) {
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            <span>Menunggu</span>
          </div>
        );
      case "needs_revision":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-info/10 text-info font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            <span>Perlu Revisi</span>
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            <span>Ditolak</span>
          </div>
        );
    }
  };

  const renderContextColumn = () => {
    if (activeTab === "pending") {
      return (
        <div className="flex flex-col">
          <span>{request.submittedAt}</span>
          <span className="font-eyebrow text-eyebrow text-ink-subtle">
            WIB
          </span>
        </div>
      );
    }
    if (activeTab === "needs_revision") {
      return (
        <div className="flex items-start gap-1.5 p-2 rounded-lg bg-info/10 text-info max-w-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-info" />
          <span className="font-caption text-caption leading-tight font-medium">
            {request.rejectionReason || "Scan SIP buram tidak terbaca stempel Dinkes"}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-danger/10 text-danger max-w-xs">
        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
        <span className="font-caption text-caption leading-tight font-medium">
          {request.rejectionReason || "Masa berlaku STR telah kedaluwarsa"}
        </span>
      </div>
    );
  };

  const renderActionButton = () => {
    const href = `/admin/doctor-verifications/detail?id=${encodeURIComponent(request.id)}`;

    if (activeTab === "pending") {
      return (
        <Link
          href={href}
          className="h-9 px-4 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold hover:bg-secondary-container shadow-sm inline-flex items-center gap-1.5 ml-auto transition-all hover:translate-x-0.5"
        >
          <span>Review Detail</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      );
    }
    if (activeTab === "needs_revision") {
      return (
        <Link
          href={href}
          className="h-9 px-4 rounded-xl bg-surface-container text-role-accent-admin font-caption text-caption font-semibold hover:bg-surface-container-high shadow-sm inline-flex items-center gap-1.5 ml-auto transition-colors"
        >
          <span>Review Detail</span>
          <FileEdit className="w-4 h-4" />
        </Link>
      );
    }
    return (
      <Link
        href={href}
        className="h-9 px-4 rounded-xl bg-surface-alt text-ink-muted hover:text-ink font-caption text-caption font-semibold hover:bg-surface-container shadow-sm inline-flex items-center gap-1.5 ml-auto transition-colors border border-border/40"
      >
        <span>Review Detail</span>
        <Eye className="w-4 h-4" />
      </Link>
    );
  };

  return (
    <tr className="hover:bg-surface-alt/70 transition-colors group border-b border-border/40">
      {/* 1. Pemohon */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="relative shrink-0">
            {request.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={request.avatarUrl}
                alt={request.name}
                className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-surface"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center font-headline-sm font-semibold shadow-sm ring-2 ring-surface">
                {initials || "DR"}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface ${
                activeTab === "pending"
                  ? "bg-warning"
                  : activeTab === "needs_revision"
                    ? "bg-info"
                    : "bg-danger"
              }`}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/admin/doctor-verifications/detail?id=${encodeURIComponent(request.id)}`}
              className="font-headline-sm text-headline-sm text-ink font-semibold truncate group-hover:text-role-accent-admin transition-colors"
            >
              {request.name}
            </Link>
            <span className="font-caption text-caption text-ink-subtle">
              ID: {idCode}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Email */}
      <td className="py-4 px-4 text-ink-muted whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-ink-subtle shrink-0" />
          <span className="truncate">{request.email}</span>
        </div>
      </td>

      {/* 3. Nomor STR */}
      <td className="py-4 px-4 whitespace-nowrap">
        <span className="font-caption text-caption font-mono bg-surface-alt text-ink px-2.5 py-1 rounded-md border border-border/40">
          {request.identity}
        </span>
      </td>

      {/* 4. Spesialisasi */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-role-accent-doctor shrink-0" />
          <span className="font-caption text-caption font-medium text-ink">
            {request.specialization}
          </span>
        </div>
      </td>

      {/* 5. Dynamic Context Column */}
      <td className="py-4 px-4 whitespace-nowrap">{renderContextColumn()}</td>

      {/* 6. Status Badge */}
      <td className="py-4 px-4 whitespace-nowrap">{renderStatusBadge()}</td>

      {/* 7. Action Button */}
      <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
        {renderActionButton()}
      </td>
    </tr>
  );
}
