"use client";

import { useEffect, useState } from "react";

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
      const res = await fetch("/api/login-activity");
      const json = await res.json();
      setSessions(json.data || []);
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
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setPasswordMsg({ type: "success", text: json.meta?.message || "Password berhasil diubah" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: json.message || "Gagal mengubah password" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Terjadi kesalahan saat mengubah password" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = async (uuid: string) => {
    try {
      setRevokingId(uuid);
      await fetch(`/api/login-activity/${uuid}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.uuid !== uuid));
    } catch {
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      await fetch("/api/logout-all", { method: "POST" });
      window.location.href = "/login?clear_session=true";
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
