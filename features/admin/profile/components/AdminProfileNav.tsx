"use client";

import { ProfileSettingsNav, type ProfileSettingsPage } from "@/features/user/components/ProfileSettingsNav";

/**
 * Nav pengaturan akun admin — satu sumber kebenaran via ProfileSettingsNav,
 * sehingga /admin/profile, /login-security, dan /privacy seragam dengan
 * role lain.
 */
export function AdminProfileNav({
  activePage,
}: {
  activePage: ProfileSettingsPage;
}) {
  return (
    <ProfileSettingsNav
      activePage={activePage}
      basePath="/admin/profile"
      className="w-full shrink-0 lg:w-64"
    />
  );
}