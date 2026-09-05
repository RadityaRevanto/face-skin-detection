type InfoBoxProps = {
  label: string;
  value: string;
  className?: string;
};

export function InfoBox({ label, value, className = "" }: InfoBoxProps) {
  return (
    <div className={`rounded-xl bg-slate-50/80 p-3.5 ${className}`}>
      <p className='mb-1 text-xs text-slate-400'>{label}</p>
      <p className='text-sm font-semibold text-slate-900'>{value}</p>
    </div>
  );
}
