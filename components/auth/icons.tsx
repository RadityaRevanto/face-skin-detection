import { type ReactNode } from "react";

export function UserIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0'
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M4.5 7.5 12 12.75 19.5 7.5M5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v7.5A2.25 2.25 0 0 1 18.75 18H5.25A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6Z'
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.5 10.5V7.875a4.5 4.5 0 0 0-9 0V10.5M6.75 10.5h10.5A1.5 1.5 0 0 1 18.75 12v6A1.5 1.5 0 0 1 17.25 19.5H6.75A1.5 1.5 0 0 1 5.25 18v-6a1.5 1.5 0 0 1 1.5-1.5Z'
      />
    </svg>
  );
}

export function BadgeIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 12.75 11.25 15 15 9.75M12 3.75l6.75 3v4.95c0 4.28-2.72 8.1-6.75 9.55-4.03-1.45-6.75-5.27-6.75-9.55V6.75l6.75-3Z'
      />
    </svg>
  );
}

export function StethoscopeIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 4.5v5.25a4.5 4.5 0 0 0 9 0V4.5M4.5 4.5H7.5M13.5 4.5h3M15 10.5v3.75A4.25 4.25 0 0 0 19.25 18.5h.25a2 2 0 1 0-2-2'
      />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg
      aria-hidden='true'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 16.5V4.5m0 0L7.5 9M12 4.5 16.5 9M4.5 16.5v1.875A2.625 2.625 0 0 0 7.125 21h9.75a2.625 2.625 0 0 0 2.625-2.625V16.5'
      />
    </svg>
  );
}

export function EyeIcon({ hidden }: { hidden?: boolean }) {
  return (
    <svg
      aria-hidden='true'
      className='h-4 w-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.8'
    >
      {hidden ? (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3.98 8.22A10.5 10.5 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.53 0 2.91-.44 4.11-1.08M6.53 6.53C8.02 5.72 9.84 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75a12.34 12.34 0 0 1-2.67 3.35M3 3l18 18'
        />
      ) : (
        <>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.25 12S6 5.25 12 5.25 21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
          />
        </>
      )}
    </svg>
  );
}

export function LeafLogo() {
  return (
    <svg aria-hidden='true' className='h-9 w-9' viewBox='0 0 48 48' fill='none'>
      <path
        d='M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z'
        fill='#10B981'
      />
      <path
        d='M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z'
        fill='#047857'
      />
      <path
        d='M12 31.5c6.6-8.1 13.5-14.4 24-20.4'
        stroke='white'
        strokeLinecap='round'
        strokeWidth='2'
      />
    </svg>
  );
}

export function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'>
      {children}
    </span>
  );
}
