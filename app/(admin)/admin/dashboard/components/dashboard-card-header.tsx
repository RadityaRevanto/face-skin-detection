import Link from "next/link";

type DashboardCardHeaderProps = {
  title: string;
  description: string;
  href?: string;
};

export function DashboardCardHeader({
  title,
  description,
  href,
}: DashboardCardHeaderProps) {
  return (
    <div className='flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4'>
      <div>
        <h2 className='text-sm font-semibold text-gray-900'>{title}</h2>
        <p className='mt-0.5 text-xs text-gray-400'>{description}</p>
      </div>

      {href ? (
        <Link
          href={href}
          className='shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800'
        >
          View all
        </Link>
      ) : null}
    </div>
  );
}
