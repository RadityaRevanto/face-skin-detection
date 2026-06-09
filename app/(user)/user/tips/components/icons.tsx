import type { ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  className?: string;
};

function Icon({ children, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      {children}
    </svg>
  );
}

export function BulbIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M9 18h6m-5 3h4m2.5-10.5A4.5 4.5 0 0 0 7.7 12c.5 1.2 1.4 2 2.1 2.9.5.6.7 1.2.7 2.1h3c0-.9.2-1.5.7-2.1.7-.9 1.6-1.7 2.1-2.9.2-.5.2-1 .2-1.5Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function ShieldIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M12 3 5 6v5.3c0 4.4 2.9 8.4 7 9.7 4.1-1.3 7-5.3 7-9.7V6l-7-3Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='m9 12 2 2 4-4'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function CalendarIcon() {
  return (
    <Icon className='h-4 w-4'>
      <path
        d='M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function InfoIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}
