export function NavIcon({ children, viewBox = "0 0 24 24" }: { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} fill="none" className="h-5 w-5">
      {children}
    </svg>
  );
}

export const navIconStroke = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
} as const;
