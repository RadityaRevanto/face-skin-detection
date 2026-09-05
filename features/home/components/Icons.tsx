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

export function ShieldIcon() {
  return (
    <Icon className='h-6 w-6'>
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

export function ClockIcon() {
  return (
    <Icon className='h-6 w-6'>
      <path
        d='M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </Icon>
  );
}

export function LockIcon() {
  return (
    <Icon className='h-6 w-6'>
      <path
        d='M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z'
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
    <Icon className='h-5 w-5'>
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

export function ArrowRightIcon() {
  return (
    <Icon className='h-4 w-4'>
      <path
        d='m9 18 6-6-6-6'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Icon>
  );
}
