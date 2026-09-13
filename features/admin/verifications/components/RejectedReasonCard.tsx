import { Card } from "@/components/ui/card";

type RejectedReasonCardProps = {
  reason: string | null;
};

export function RejectedReasonCard({ reason }: RejectedReasonCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-rose-100 bg-white text-slate-950 shadow-sm dark:border-rose-100'>
      <div className='border-b border-rose-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-slate-900'>
          Alasan Penolakan
        </h3>
        <p className='mt-0.5 text-sm text-slate-400'>
          Catatan admin ketika pengajuan verifikasi dokter ditolak.
        </p>
      </div>

      <div className='p-6'>
        <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold leading-6 text-rose-700'>
          {reason || "Tidak ada alasan penolakan yang tersimpan."}
        </div>
      </div>
    </Card>
  );
}
