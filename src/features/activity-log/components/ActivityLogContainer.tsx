"use client";

import { useState, useEffect, useCallback } from "react";
import type { ActivityLog } from "../types";
import { getActivityLog } from "../lib/activityLogService";
import { ActivityLogItem } from "./ActivityLogItem";

export function ActivityLogContainer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { data, meta } = await getActivityLog(page, 20);
      setLogs(data);
      setTotalPages(meta.last_page);
      setTotal(meta.total);
    } catch (error) {
      console.error("Failed to fetch activity log:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Activity Log
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {total} aktivitas tercatat
        </p>
      </div>

      {/* Log List */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div>
            {logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Belum ada aktivitas
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            Sebelumnya
          </button>
          <span className="px-4 py-2 text-sm font-medium text-slate-600">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
