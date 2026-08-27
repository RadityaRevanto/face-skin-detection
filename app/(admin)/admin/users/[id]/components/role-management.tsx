"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoleManagementProps {
  userId: string;
  currentRole: string;
}

export function RoleManagement({ userId, currentRole }: RoleManagementProps) {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleRoleChange = async () => {
    if (role === currentRole) return;
    
    if (!confirm(`Anda yakin ingin mengubah role pengguna ini menjadi ${role}?`)) {
      setRole(currentRole);
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengubah role");
      }
      
      alert("Role berhasil diubah!");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setRole(currentRole);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Shield size={20} />
        </div>
        <h3 className="font-bold text-slate-900">Manajemen Role</h3>
      </div>
      
      <p className="text-sm text-slate-500 mb-5">
        Ubah hak akses pengguna ini dalam sistem. Pastikan Anda berhati-hati saat memberikan akses admin.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <select 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isUpdating}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
        >
          <option value="user">Pasien (User)</option>
          <option value="doctor">Dokter</option>
          <option value="admin">Admin</option>
        </select>
        
        <button
          onClick={handleRoleChange}
          disabled={isUpdating || role === currentRole}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
