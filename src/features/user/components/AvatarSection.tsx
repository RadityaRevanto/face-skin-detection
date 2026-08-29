"use client";

import { Camera, Trash2, User } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";

type Props = {
  profile: UserProfile;
  avatarPreview: string | null;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAvatar: () => void;
};

export function AvatarSection({
  profile,
  avatarPreview,
  isLoading,
  fileInputRef,
  onAvatarClick,
  onFileChange,
  onDeleteAvatar,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 shrink-0 mx-auto sm:mx-0">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-50 bg-zinc-100 shadow-md">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <User size={48} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onAvatarClick}
          className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-colors border-2 border-white"
          title="Ganti Foto"
        >
          <Camera size={18} />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {avatarPreview && !profile.google_avatar_url && (
        <button
          type="button"
          onClick={onDeleteAvatar}
          disabled={isLoading}
          className="text-xs text-rose-600 font-medium hover:text-rose-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} /> Hapus Foto
        </button>
      )}
      <p className="text-[11px] text-zinc-400 text-center max-w-35">
        Format JPG, PNG, WEBP. Maks 2MB.
      </p>
    </div>
  );
}
