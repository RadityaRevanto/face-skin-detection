import type { IconProps } from "./VerificationTypes";

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

export function CheckIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='m5 12 4 4L19 6'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Icon>
  );
}

export function XIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='m6 6 12 12M18 6 6 18'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Icon>
  );
}

export function DocumentIcon() {
  return (
    <Icon className='h-5 w-5'>
      <path
        d='M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='M14 3v5h5M8.5 13h7M8.5 17h5'
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
