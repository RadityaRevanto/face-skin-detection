import { Card } from "@/components/ui/card";

type RejectedReasonCardProps = {
  reason: string | null;
};

export function RejectedReasonCard({ reason }: RejectedReasonCardProps) {
  return (
    <Card className='border-[var(--destructive-fg)]/20'>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Alasan Penolakan
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Catatan admin ketika pengajuan verifikasi dokter ditolak.
        </p>
      </div>

      <div className='p-6'>
        <div className='rounded-[var(--radius-control)] bg-[var(--destructive-bg)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--destructive-fg)]'>
          {reason || "Tidak ada alasan penolakan yang tersimpan."}
        </div>
      </div>
    </Card>
  );
}