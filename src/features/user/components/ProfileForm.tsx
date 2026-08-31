"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, updateProfile, deleteAvatar } from "@/lib/api/profile-query";
import { CropImageModal } from "./CropImageModal";
import { AvatarSection } from "./AvatarSection";
import { ProfileFields } from "./ProfileFields";

interface ProfileFormProps {
  profile: UserProfile;
  onProfileUpdated?: (updatedProfile: UserProfile) => void;
}

export function ProfileForm({ profile, onProfileUpdated }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || profile.google_avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Ukuran foto maksimal 2MB");
        return;
      }
      // Buka modal crop
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setErrorMsg(null);
      // Reset input value so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedFile: File, croppedUrl: string) => {
    setAvatarFile(croppedFile);
    setAvatarPreview(croppedUrl);
    setImageToCrop(null);
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto profil?")) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await deleteAvatar();
      setAvatarPreview(res.data.google_avatar_url || null);
      setAvatarFile(null);
      setSuccessMsg("Foto profil berhasil dihapus");
      if (onProfileUpdated) onProfileUpdated({ ...profile, avatar_url: null });
      router.refresh(); // Refresh the layout to update the navbar avatar
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal menghapus foto profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Add avatar file if changed
      if (avatarFile) {
        formData.set("avatar", avatarFile);
      }

      const res = await updateProfile(formData);
      setSuccessMsg(res.meta?.message || "Profil berhasil diperbarui");

      // Update local state if needed
      if (res.data.avatar_url) setAvatarPreview(res.data.avatar_url);
      setAvatarFile(null);

      if (onProfileUpdated) onProfileUpdated(res.data);

      router.refresh(); // Refresh the layout to update the navbar avatar
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan saat menyimpan profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="p-6 sm:p-8">

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            {successMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <AvatarSection
            profile={profile}
            avatarPreview={avatarPreview}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
            onAvatarClick={() => fileInputRef.current?.click()}
            onFileChange={handleAvatarChange}
            onDeleteAvatar={handleDeleteAvatar}
          />

          <ProfileFields
            profile={profile}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {imageToCrop && (
        <CropImageModal
          imageSrc={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
