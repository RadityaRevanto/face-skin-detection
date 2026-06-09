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

export function CameraIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d='M4 8.5A2.5 2.5 0 0 1 6.5 6h1.4l1.2-1.7A2 2 0 0 1 10.7 3.5h2.6a2 2 0 0 1 1.6.8L16.1 6h1.4A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z'
        stroke='currentColor'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function BoltIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='m13 2-8 12h6l-1 8 8-12h-6l1-8Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function RefreshIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3M17 3v4h4M7 21v-4H3'
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
