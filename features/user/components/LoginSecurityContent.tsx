"use client";

import { useEffect, useState } from "react";

import { profileService } from "@/features/profile/services/profileService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import { PasswordChangeSection } from "./PasswordChangeSection";
import { LoginActivitySection } from "./LoginActivitySection";
import { LogoutAllSection } from "./LogoutAllSection";
import { DeviceTokensSection } from "./DeviceTokensSection";

interface LoginActivity {
  uuid: string;
  device: string;
  ip_address: string;
  location: { city?: string; country?: string } | null;
  is_current: boolean;
  last_used_at: string;
  created_at: string;
}

export function LoginSecurityContent({ showDeviceTokens = false }: { showDeviceTokens?: boolean }) {
  const { logoutAll } = useAuth();
  const [sessions, setSessions] = useState<LoginActivity[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await profileService.loginActivity();
      setSessions((response.data as unknown as LoginActivity[]) || []);
    } catch {
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password baru minimal 8 karakter" });
      return;
    }

    try {
      setIsChangingPassword(true);
      const data = await profileService.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      const message = (data?.meta?.message as string) || "Password berhasil diubah";
      setPasswordMsg({ type: "success", text: message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMsg({ type: "error", text: getUserFriendlyErrorMessage(error) });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = async (uuid: string) => {
    try {
      setRevokingId(uuid);
      await profileService.revokeSession(uuid);
      setSessions((prev) => prev.filter((s) => s.uuid !== uuid));
    } catch {
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      await logoutAll();
    } catch {
      setIsLoggingOutAll(false);
      setShowLogoutAll(false);
    }
  };

  const formatLocation = (loc: LoginActivity["location"]) => {
    if (!loc) return null;
    const parts = [loc.city, loc.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <PasswordChangeSection
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        isChangingPassword={isChangingPassword}
        passwordMsg={passwordMsg}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        handleChangePassword={handleChangePassword}
      />

      <LoginActivitySection
        sessions={sessions}
        isLoadingSessions={isLoadingSessions}
        revokingId={revokingId}
        fetchSessions={fetchSessions}
        handleRevokeSession={handleRevokeSession}
        formatLocation={formatLocation}
        formatDate={formatDate}
      />

      {showDeviceTokens && <DeviceTokensSection />}

      <LogoutAllSection
        showLogoutAll={showLogoutAll}
        isLoggingOutAll={isLoggingOutAll}
        setShowLogoutAll={setShowLogoutAll}
        handleLogoutAll={handleLogoutAll}
      />
    </div>
  );
}
