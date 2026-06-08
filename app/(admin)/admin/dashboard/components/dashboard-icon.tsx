type DashboardIconProps = {
  name: string;
};

export function DashboardIcon({ name }: DashboardIconProps) {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
  } as const;

  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' className='h-6 w-6'>
      {name === "users" ? (
        <>
          <path d='M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4' {...common} />
          <path d='M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' {...common} />
          <path d='M20 19c0-1.7-1-3.1-2.5-3.7' {...common} />
          <path d='M15.5 5.3a3 3 0 0 1 0 5.4' {...common} />
        </>
      ) : null}

      {name === "stethoscope" ? (
        <>
          <path d='M7 4v5a5 5 0 0 0 10 0V4' {...common} />
          <path d='M7 4H5' {...common} />
          <path d='M17 4h2' {...common} />
          <path d='M12 14v2a4 4 0 0 0 8 0v-1' {...common} />
          <path d='M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' {...common} />
        </>
      ) : null}

      {name === "shield" ? (
        <>
          <path
            d='M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z'
            {...common}
          />
          <path d='m9 12 2 2 4-4' {...common} />
        </>
      ) : null}

      {name === "blocked" ? (
        <>
          <path d='M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4' {...common} />
          <path d='M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' {...common} />
          <path d='m17 8 4 4' {...common} />
          <path d='m21 8-4 4' {...common} />
        </>
      ) : null}
    </svg>
  );
}
