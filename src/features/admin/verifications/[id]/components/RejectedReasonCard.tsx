import { Card } from "@/components/ui/card";

type RejectedReasonCardProps = {
  reason: string | null;
};

export function RejectedReasonCard({ reason }: RejectedReasonCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-rose-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-rose-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-rose-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Alasan Penolakan
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
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
