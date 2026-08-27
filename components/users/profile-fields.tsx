"use client";

import { User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/api/profile-query";

type Props = {
  profile: UserProfile;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function ProfileFields({ profile, isLoading, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex-1 w-full space-y-5">

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
  );
}
