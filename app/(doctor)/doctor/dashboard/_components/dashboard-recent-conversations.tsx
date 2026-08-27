import Link from "next/link";

type RecentConversation = {
  uuid: string;
  user?: { full_name?: string | null } | null;
  message_count?: number | null;
  last_message?: {
    content?: string | null;
    sender_role?: string | null;
    created_at?: string | null;
  } | null;
};

type DashboardRecentConversationsProps = {
  conversations: RecentConversation[];
  formatRelativeTime: (dateStr: string | null) => string;
};

export function DashboardRecentConversations({
  conversations,
  formatRelativeTime,
}: DashboardRecentConversationsProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Percakapan Terbaru
        </h2>
        <Link
          href="/doctor/consultations"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Lihat semua
        </Link>
      </div>

      {conversations.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Belum ada percakapan.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {conversations.map((conv) => (
            <Link
              key={conv.uuid}
              href={`/doctor/consultations?conversation=${conv.uuid}`}
              className="flex items-center gap-4 py-3 transition-colors hover:bg-slate-50 -mx-3 px-3 rounded-xl"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {(conv.user?.full_name ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {conv.user?.full_name ?? "Pengguna"}
                  </span>
                  {conv.message_count != null && (
                    <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {conv.message_count} pesan
                    </span>
                  )}
                </div>
                {conv.last_message?.content && (
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {conv.last_message.sender_role === "doctor" ? "Anda: " : ""}
                    {conv.last_message.content}
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 text-[11px] font-medium text-slate-400">
                {formatRelativeTime(conv.last_message?.created_at ?? null)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
