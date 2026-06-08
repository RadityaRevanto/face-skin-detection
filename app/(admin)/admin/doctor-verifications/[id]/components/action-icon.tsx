type ActionIconProps = {
  type: "approve" | "reject" | "revision";
};

export function ActionIcon({ type }: ActionIconProps) {
  if (type === "approve") {
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
          d='m5 12 4 4L19 6'
        />
      </svg>
    );
  }

  if (type === "revision") {
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
          d='M4 7h10a5 5 0 0 1 0 10H8'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='m8 11-4-4 4-4'
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
        d='M6 18 18 6M6 6l12 12'
      />
    </svg>
  );
}
