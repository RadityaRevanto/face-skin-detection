import Link from "next/link";
import { CreditCard, Clock } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";

export function SubscriptionCard({ profile }: { profile: UserProfile }) {
  const remaining = profile.remaining_free_messages ?? 3;
  const total = 3;
  const quotaPercent = Math.round((remaining / total) * 100);

  return (
    <div className="mt-4 p-5 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard size={64} /></div>
      <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Status Langganan</p>
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        Skincek {profile.subscription_status === 'Pro' ? <span className="text-amber-400">PRO</span> : 'FREE'}
      </h3>
      {profile.subscription_status !== 'Pro' && (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs"><Clock size={14} className="text-emerald-400" /> Total Scan</div>
            <span className="font-bold text-sm">{profile.scan_count || 0}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-snug px-1">Kuota scan gratis 3x/hari untuk pengguna Free.</p>

          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs"><Clock size={14} className="text-emerald-400" /> Sisa Chat</div>
              <span className="font-bold text-sm">{remaining} / {total}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1.5 leading-snug">Sisa pesan gratis konsultasi dengan dokter.</p>
          </div>

          <Link href="/user/subscription" className="block w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors text-center">Upgrade Pro</Link>
        </div>
      )}
      {profile.subscription_status === 'Pro' && (
        <div className="mt-2 space-y-2">
          <div className="bg-emerald-500/20 rounded-lg p-2.5 text-center">
            <p className="text-xs text-emerald-300 font-medium">Konsultasi tanpa batas</p>
          </div>
          <Link href="/user/subscription" className="block w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors text-center">Kelola Langganan</Link>
        </div>
      )}
    </div>
  );
}
