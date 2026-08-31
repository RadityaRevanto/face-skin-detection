type ActionIconProps = {
  type: "approve" | "reject";
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
