"use client";

import { useState, type ReactNode } from "react";
import { DoctorSidebar } from "./DoctorSidebar";
import { DoctorTopbar } from "./DoctorTopbar";

export type DoctorAppShellProps = {
  children: ReactNode;
};

export function DoctorAppShell({ children }: DoctorAppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div
      data-role="doctor"
      className="doctor-theme min-h-screen bg-background text-on-surface flex flex-col font-sans"
    >
      <DoctorSidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <div className="pl-0 lg:pl-[264px] min-h-screen flex flex-col transition-all duration-300">
        <DoctorTopbar onOpenMobileMenu={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 pt-16 w-full px-4 sm:px-6 lg:px-8 bg-background">
          <div className="flex flex-col w-full py-6 sm:py-8 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
