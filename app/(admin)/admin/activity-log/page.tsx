import { getActivityLogPageData } from "./lib/activity-query";

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const data = await getActivityLogPageData(page);

  const getEventBadge = (event: string) => {
    switch (event.toLowerCase()) {
      case "created":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg">Created</span>;
      case "updated":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-lg">Updated</span>;
      case "deleted":
        return <span className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-800 rounded-lg">Deleted</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-800 rounded-lg">{event}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">System Activity Log</h1>
        <p className="text-sm text-zinc-500 mt-1">Pantau seluruh perubahan sistem, manajemen peran, dan aktivitas krusial lainnya.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50 text-zinc-700 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Tindakan</th>
                <th className="px-6 py-4 font-semibold">Event</th>
                <th className="px-6 py-4 font-semibold">Dilakukan Oleh</th>
                <th className="px-6 py-4 font-semibold">Detail Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    Tidak ada aktivitas yang ditemukan.
                  </td>
                </tr>
              ) : (
                data.data.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta"
                      }).format(new Date(log.created_at))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{log.description}</div>
                      <div className="text-xs text-zinc-500 mt-1">Kategori: {log.log_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getEventBadge(log.event)}
                    </td>
                    <td className="px-6 py-4">
                      {log.causer ? (
                        <div>
                          <div className="font-medium text-zinc-900">{log.causer.full_name}</div>
                          <div className="text-xs text-zinc-500">{log.causer.email}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">Sistem / Tidak diketahui</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-500 max-w-xs truncate">
                      {log.subject_type ? (
                        <>
                          <div>ID: {log.subject_id}</div>
                          <div className="truncate" title={log.subject_type}>{log.subject_type.split('\\').pop()}</div>
                        </>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination minimalis */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Halaman {data.pagination.currentPage} dari {data.pagination.totalPages}
          </span>
          <div className="flex gap-2">
            {data.pagination.currentPage > 1 && (
              <a 
                href={`/admin/activity-log?page=${data.pagination.currentPage - 1}`}
                className="px-3 py-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Sebelumnya
              </a>
            )}
            {data.pagination.currentPage < data.pagination.totalPages && (
              <a 
                href={`/admin/activity-log?page=${data.pagination.currentPage + 1}`}
                className="px-3 py-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Selanjutnya
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
