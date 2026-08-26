"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, updateProfile, deleteAvatar } from "@/lib/api/profile-query";
import { Camera, Trash2, User, Mail, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CropImageModal } from "./crop-image-modal";

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

      // Remove empty optional fields
      const password = formData.get("password") as string;
      if (!password || password.trim() === "") {
        formData.delete("password");
      }

      const res = await updateProfile(formData);
      setSuccessMsg(res.meta?.message || "Profil berhasil diperbarui");
      
      // Update local state if needed
      if (res.data.avatar_url) setAvatarPreview(res.data.avatar_url);
      setAvatarFile(null);
      
      if (onProfileUpdated) onProfileUpdated(res.data);
      
      // Reset password field
      const pwdInput = form.querySelector('input[name="password"]') as HTMLInputElement;
      if (pwdInput) pwdInput.value = "";
      
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
          {/* Avatar Section */}
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
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-colors border-2 border-white"
                title="Ganti Foto"
              >
                <Camera size={18} />
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/png,image/webp,image/jpg" 
              className="hidden" 
            />
            
            {avatarPreview && !profile.google_avatar_url && (
              <button 
                type="button" 
                onClick={handleDeleteAvatar}
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

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 w-full space-y-5">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><User size={18} /></span>
                  <input 
                    name="full_name"
                    type="text" 
                    defaultValue={profile.full_name || ""}
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Nama Lengkap"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email (Tidak dapat diubah)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Mail size={18} /></span>
                  <input 
                    type="email" 
                    defaultValue={profile.email || ""}
                    disabled
                    className="w-full bg-zinc-100/70 border border-zinc-200/60 text-zinc-500 rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Tanggal Lahir</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Calendar size={18} /></span>
                    <input 
                      name="date_of_birth"
                      type="date" 
                      defaultValue={profile.date_of_birth || ""}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Jenis Kelamin</label>
                  <select 
                    name="gender"
                    defaultValue={profile.gender || ""}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                  >
                    <option value="" disabled>Pilih Jenis Kelamin</option>
                    <option value="laki_laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Ubah Password <span className="text-zinc-400 font-normal">(Opsional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Lock size={18} /></span>
                  <input 
                    name="password"
                    type="password" 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Minimal 8 karakter"
                    minLength={8}
                  />
                </div>
                <p className="text-[11.5px] text-zinc-500 mt-1.5 ml-1">Biarkan kosong jika tidak ingin mengubah password.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-11"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
            
          </form>
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
