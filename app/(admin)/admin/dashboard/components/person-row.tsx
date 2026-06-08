type PersonRowProps = {
  name: string;
  email: string;
  meta: string;
};

export function PersonRow({ name, email, meta }: PersonRowProps) {
  return (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5'>
      <div className='min-w-0'>
        <p className='truncate text-sm font-semibold text-gray-900'>{name}</p>
        <p className='truncate text-xs text-gray-500'>{email}</p>
      </div>

      <span className='shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm'>
        {meta}
      </span>
    </div>
  );
}
