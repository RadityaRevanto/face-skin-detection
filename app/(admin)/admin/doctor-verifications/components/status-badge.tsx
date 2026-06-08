type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Approved") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm'>
        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm'>
        <span className='h-1.5 w-1.5 rounded-full bg-rose-500' />
        Rejected
      </span>
    );
  }

  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm'>
      <span className='h-1.5 w-1.5 rounded-full bg-sky-500' />
      Pending
    </span>
  );
}
