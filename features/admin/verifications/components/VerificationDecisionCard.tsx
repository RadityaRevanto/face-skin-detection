"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminService } from "@/features/admin/services/adminService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

type VerificationDecisionCardProps = {
  verificationId: string;
};

export function VerificationDecisionCard({
  verificationId,
}: VerificationDecisionCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitAction(type: "approve" | "reject") {
    const trimmedNote = note.trim();

    if (type === "reject" && !trimmedNote) {
      customToast.warning("Alasan penolakan wajib diisi sebelum reject.");
      return;
    }

    setIsLoading(true);

    try {
      await adminService.reviewVerification(
        verificationId,
        type === "approve" ? "approved" : "rejected",
        type === "approve" ? undefined : trimmedNote,
      );

      customToast.success(
        type === "approve" ? "Verifikasi disetujui" : "Verifikasi ditolak",
        { description: "Keputusan tersimpan dan dokter sudah diberi notifikasi." },
      );

      queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "pending-verifications-count"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "verification", verificationId] });

      if (type === "approve") {
        router.push("/admin/doctors");
      } else {
        router.push("/admin/doctor-verifications/rejected");
      }

      router.refresh();
    } catch (error) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      variant="accent-top"
      className="overflow-visible shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
        <h3 className="font-heading text-base font-semibold text-[var(--ink)]">
          Keputusan Verifikasi
        </h3>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)] sm:text-sm">
          Approve dokter jika dokumen valid, atau reject dengan alasan
          penolakan.
        </p>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <div>
          <label
            htmlFor="review-note"
            className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]"
          >
            Alasan Penolakan
          </label>

          <textarea
            id="review-note"
            name="review-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Wajib diisi jika melakukan reject. Contoh: Dokumen STR tidak terbaca jelas atau tidak sesuai identitas."
            className="w-full resize-none rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface-2)]/60 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-muted)] focus:border-[var(--role-accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--role-accent-soft)]"
          />
        </div>

        {/* Mobile: stack w-full (§5.7); desktop: berdampingan sm:grid-cols-2 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            size="lg"
            disabled={isLoading}
            onClick={() => submitAction("approve")}
            className="bg-[var(--success-bg)] text-[var(--success-fg)] shadow-none hover:bg-[var(--success-fg)]/15"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {isLoading ? "Memproses..." : "Approve"}
          </Button>

          <Button
            type="button"
            size="lg"
            disabled={isLoading}
            onClick={() => submitAction("reject")}
            className="bg-[var(--destructive-bg)] text-[var(--destructive-fg)] shadow-none hover:bg-[var(--destructive-fg)]/15"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Reject
          </Button>
        </div>

        <p className="text-center text-[11px] text-[var(--ink-muted)]">
          Keputusan bersifat permanen — pastikan dokumen sudah diverifikasi.
        </p>
      </div>
    </Card>
  );
}