"use client";

import { ProfileSettingsNav, type ProfileSettingsPage } from "./ProfileSettingsNav";

type PrivacySidebarProps = {
  basePath: string;
  activePage: ProfileSettingsPage;
};

/**
 * Sidebar 3-section pengaturan akun — delegate satu-satunya ke ProfileSettingsNav.
 */
export function PrivacySidebar({ basePath, activePage }: PrivacySidebarProps) {
  return (
    <div className="flex w-full flex-col gap-2 lg:w-64 lg:shrink-0">
      <ProfileSettingsNav activePage={activePage} basePath={basePath} />
    </div>
  );
}