type SkincareActionIconProps = {
  type: "edit" | "delete";
};

export function SkincareActionIcon({ type }: SkincareActionIconProps) {
  if (type === "edit") {
    return (
      <svg
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='m16.9 4.6 2.5 2.5M4 20h4.8L19.7 9.1a1.8 1.8 0 0 0 0-2.5l-2.3-2.3a1.8 1.8 0 0 0-2.5 0L4 15.2V20Z'
        />
      </svg>
    );
  }

  return (
    <svg
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M6 7h12m-10 0 .7 12.2A2 2 0 0 0 10.7 21h2.6a2 2 0 0 0 2-1.8L16 7M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7'
      />
    </svg>
  );
}
