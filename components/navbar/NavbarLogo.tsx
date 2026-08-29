import Link from "next/link";
import type { ReactNode } from "react";

import { LogoMark } from "./NavbarIcons";

type NavbarLogoProps = {
  brand: {
    href: string;
    logo: ReactNode;
    title: string;
    subtitle?: string;
  };
  onClick?: () => void;
};

export function NavbarLogo({ brand, onClick }: NavbarLogoProps) {
  return (
    <Link href={brand.href} className="flex shrink-0 items-center gap-2.5" onClick={onClick}>
      {brand.logo || <LogoMark />}
      <div className={onClick ? "" : "hidden sm:block"}>
        <p className="text-base font-bold tracking-tight text-slate-900">{brand.title}</p>
        {brand.subtitle ? (
          <p className="text-xs font-semibold text-emerald-600">{brand.subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}
