"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProfileIncompleteModalProps {
  onSuccess: () => void;
}

export function ProfileIncompleteModal({ onSuccess }: ProfileIncompleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !dob) {
      setError("Semua kolom harus diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: gender,
          date_of_birth: dob,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan data.");
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
        
        <h2 className="text-xl font-bold text-zinc-900 mb-2 mt-2">Lengkapi Profil Anda</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Sebelum melakukan scan wajah, mohon lengkapi data jenis kelamin dan tanggal lahir untuk hasil prediksi yang lebih akurat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Jenis Kelamin</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>Pilih Jenis Kelamin</option>
              <option value="laki_laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Tanggal Lahir</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
