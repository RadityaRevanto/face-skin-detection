import Link from "next/link";
import type { UserProfile } from "@/lib/api/profile-query";

export function SubscriptionCard({ profile }: { profile: UserProfile }) {
  const remaining = profile.remaining_free_messages ?? 3;
  const total = 3;
  const quotaPercent = Math.round((remaining / total) * 100);

  return (
    <div className="mt-4 rounded-2xl bg-zinc-900 p-5 text-white shadow-sm">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        Skincek {profile.subscription_status === 'Pro' ? <span className="text-amber-400">PRO</span> : 'FREE'}
      </h3>
      {profile.subscription_status !== 'Pro' && (
        <div className="space-y-3">
          <div className="rounded-lg bg-white/10 p-2.5 flex items-center justify-between">
            <span className="text-xs text-zinc-300">Total Scan</span>
            <span className="font-bold text-sm">{profile.scan_count || 0}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-snug px-1">Kuota scan gratis 3x/hari untuk pengguna Free.</p>

          <div className="rounded-lg bg-white/10 p-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-300">Sisa Chat</span>
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

          <Link href="/user/subscription" className="block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg mt-2 transition-colors text-center">Upgrade Pro</Link>
        </div>
      )}
      {profile.subscription_status === 'Pro' && (
        <div className="mt-2 space-y-2">
          <div className="rounded-lg bg-emerald-500/20 p-2.5 text-center">
            <p className="text-xs text-emerald-300 font-medium">Konsultasi tanpa batas</p>
          </div>
          <Link href="/user/subscription" className="block w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors text-center">Kelola Langganan</Link>
        </div>
      )}
    </div>
  );
}
