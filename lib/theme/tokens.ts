/**
 * Shared design tokens for all roles (user, admin, doctor).
 *
 * These tokens define the single source of truth for spacing, radius,
 * shadows, and card styles used across the application.
 *
 * No color palette changes — only structural/spacing tokens.
 */

export const tokens = {
  /** Border radius scale */
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  } as const,

  /** Shadow scale */
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  } as const,

  /** Card wrapper class */
  card: "rounded-2xl bg-white shadow-sm ring-1 ring-slate-100",

  /** Page wrapper class */
  pageWrapper: "px-4 py-6 sm:px-6 sm:py-8 lg:px-8",

  /** Content grid: sidebar + main on large screens */
  contentGrid: "min-w-0 flex-1",
} as const;
