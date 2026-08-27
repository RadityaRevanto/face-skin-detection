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

export function BackgroundLeaf({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      viewBox='0 0 180 180'
      fill='none'
    >
      <path
        d='M156.7 18.8C113.7 24.5 74.1 51.2 56.1 87.5c-15.8 31.8-8.9 60.5 18.1 75.6 4.8-38.2 21.1-75.4 50.4-106.7-21.7 34.3-32.1 68.8-29.8 101.6 31-9.8 56.8-34.6 67.9-66.5 8.4-24.3 6-50.3-6-72.7Z'
        fill='url(#leafGradient)'
      />
      <path
        d='M70 141.5c19.8-40.7 47.8-76.2 84.4-108.1'
        stroke='white'
        strokeOpacity='0.55'
        strokeWidth='5'
        strokeLinecap='round'
      />
      <defs>
        <linearGradient
          id='leafGradient'
          x1='43'
          x2='169'
          y1='157'
          y2='25'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#10B981' />
          <stop offset='1' stopColor='#A7F3D0' />
        </linearGradient>
      </defs>
    </svg>
  );
}
