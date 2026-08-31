type ActionIconProps = {
  type: "view" | "suspend";
};

export function ActionIcon({ type }: ActionIconProps) {
  if (type === "view") {
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
          d='M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
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
        d='M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636'
      />
    </svg>
  );
}
