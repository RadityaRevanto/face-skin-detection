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

      {name === "leaf" ? (
        <path d='M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0 8-8' {...common} />
      ) : null}

      {name === "box" ? (
        <>
          <path d='M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z' {...common} />
          <path d='M4 7.5v9L12 21l8-4.5v-9' {...common} />
          <path d='M12 12v9' {...common} />
        </>
      ) : null}

      {name === "star" ? (
        <path
          d='m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z'
          {...common}
        />
      ) : null}

      {name === "flask" ? (
        <>
          <path d='M9 3h6' {...common} />
          <path
            d='M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3'
            {...common}
          />
          <path d='M8 15h8' {...common} />
        </>
      ) : null}

      {name === "settings" ? (
        <>
          <path d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' {...common} />
          <path
            d='M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 3h5l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z'
            {...common}
          />
        </>
      ) : null}
    </svg>
  );
}
