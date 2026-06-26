type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Approved") {
    return (
      <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className='rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700'>
        Rejected
      </span>
    );
  }

  return (
    <span className='rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700'>
      Pending
    </span>
  );
}
