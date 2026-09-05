type DashboardIconProps = {
  name: string;
  /** Override ukuran (default h-6 w-6; untuk watermark kirim h-[88px] w-[88px]). */
  className?: string;
};

export function DashboardIcon({ name, className }: DashboardIconProps) {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
  } as const;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? "h-6 w-6"}
    >
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

      {name === "revenue" ? (
        <>
          <rect x="2" y="6" width="20" height="12" rx="2" {...common} />
          <circle cx="12" cy="12" r="2" {...common} />
          <path d="M6 12h.01" {...common} />
          <path d="M18 12h.01" {...common} />
        </>
      ) : null}

      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="10" {...common} />
          <polyline points="12 6 12 12 16 14" {...common} />
        </>
      ) : null}

      {name === "scan" ? (
        <>
          <path d="M7 3H5a2 2 0 00-2 2v2" {...common} />
          <path d="M17 3h2a2 2 0 012 2v2" {...common} />
          <path d="M7 21H5a2 2 0 01-2-2v-2" {...common} />
          <path d="M17 21h2a2 2 0 002-2v-2" {...common} />
          <circle cx="12" cy="10" r="3" {...common} />
          <path d="M12 13c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" {...common} />
        </>
      ) : null}

      {name === "user-plus" ? (
        <>
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...common} />
          <circle cx="9" cy="7" r="4" {...common} />
          <line x1="19" y1="8" x2="19" y2="14" {...common} />
          <line x1="22" y1="11" x2="16" y2="11" {...common} />
        </>
      ) : null}

      {name === "subscription" ? (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" {...common} />
          <line x1="2" y1="10" x2="22" y2="10" {...common} />
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
