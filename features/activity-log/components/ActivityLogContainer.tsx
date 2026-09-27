"use client";

import { useState, useEffect, useCallback } from "react";
import type { ActivityLog } from "../types";
import { getActivityLog } from "../services/activityLogService";
import { ActivityLogItem } from "./ActivityLogItem";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/page, setState di dalam async callback
    fetchLogs(currentPage);
  }, [currentPage, fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--role-accent)]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--role-accent-strong)]">
            Jejak Audit
          </p>
        </div>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900">
          Activity Log
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {total} aktivitas tercatat
        </p>
      </div>

      {/* Log List */}
      <div className="rounded-[var(--radius-card)] border border-slate-100 bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
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
          <EmptyState
            title="Belum ada aktivitas"
            description="Aktivitas admin & sistem akan tampil di sini."
            className="border-0 py-12"
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={20}
          itemLabel="aktivitas"
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
