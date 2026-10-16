"use client";

import { useMemo } from "react";
import type { DashboardCharts } from "../lib/adminDashboardTypes";

type AdminDashboardChartsProps = {
  charts: DashboardCharts;
};

export function AdminDashboardCharts({ charts }: AdminDashboardChartsProps) {
  const scansData = charts?.scans_last_14_days ?? [];
  const regsData = charts?.registrations_last_14_days ?? [];

  // Hitung peak scan dan path SVG
  const { maxScan, scanPoints, areaPath, linePath } = useMemo(() => {
    const values = scansData.map((d) => d.count);
    const max = Math.max(...values, 10);
    const width = 540;
    const height = 150;
    const paddingBottom = 15;

    if (scansData.length === 0) {
      return { maxScan: 0, scanPoints: [], areaPath: "", linePath: "" };
    }

    const step = scansData.length > 1 ? width / (scansData.length - 1) : width;
    const points = scansData.map((d, i) => {
      const x = Math.round(i * step);
      const y = Math.round(height - (d.count / max) * (height - 30) - paddingBottom);
      return { x, y, count: d.count, date: d.date };
    });

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { maxScan: max, scanPoints: points, areaPath: area, linePath: line };
  }, [scansData]);

  // Hitung bar cluster data untuk registrasi
  const barClusters = useMemo(() => {
    const values = regsData.map((d) => d.count);
    const max = Math.max(...values, 5);
    const height = 140;

    return regsData.slice(-7).map((d, i) => {
      const userHeight = Math.max(8, Math.round((d.count / max) * 110));
      const doctorHeight = Math.max(4, Math.round(userHeight * 0.25));
      const xUser = 25 + i * 70;
      const xDoc = xUser + 14;

      return {
        date: d.date.slice(5),
        count: d.count,
        xUser,
        xDoc,
        userHeight,
        doctorHeight,
        yUser: height - userHeight,
        yDoc: height - doctorHeight,
      };
    });
  }, [regsData]);

  const latestScan = scansData[scansData.length - 1]?.count ?? 0;

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Tren Scan Harian */}
      <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-surface shadow-sm border border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
                Analisis Citra Klinis
              </span>
              <span className="px-2 py-0.5 rounded-full bg-role-accent-admin/10 text-role-accent-admin font-caption text-[11px] font-semibold">
                14 Hari
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-ink font-semibold">
              Tren Scan Harian
            </h3>
            <p className="font-caption text-caption text-ink-muted">
              Puncak aktivitas: {maxScan.toLocaleString("id-ID")} scan
            </p>
          </div>
          <div className="flex items-center gap-2 font-caption text-caption text-ink-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-role-accent-admin" />
            <span>Scan AI</span>
          </div>
        </div>

        <div className="relative mt-6 pt-4">
          <div className="absolute right-4 top-2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface shadow-md border border-border font-caption text-caption text-ink">
            <span className="w-2 h-2 rounded-full bg-role-accent-admin animate-ping" />
            <span>
              Hari ini:{" "}
              <strong className="text-role-accent-admin font-mono font-semibold">
                {latestScan.toLocaleString("id-ID")} scan
              </strong>
            </span>
          </div>

          <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 540 160">
            <defs>
              <linearGradient id="adminScanFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4338CA" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="adminScanLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
            </defs>
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="20" y2="20" />
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="70" y2="70" />
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="120" y2="120" />

            {areaPath && <path d={areaPath} fill="url(#adminScanFill)" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#adminScanLine)"
                strokeLinecap="round"
                strokeWidth="3"
              />
            )}
            {scanPoints.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={idx === scanPoints.length - 1 ? 5 : 3.5}
                fill={idx === scanPoints.length - 1 ? "#4338CA" : "#FFFFFF"}
                stroke="#4338CA"
                strokeWidth="2"
              />
            ))}
          </svg>

          <div className="mt-2 flex justify-between font-caption text-caption text-ink-subtle">
            {scansData.slice(-7).map((d, i) => (
              <span key={i} className={i === 6 ? "font-semibold text-role-accent-admin" : ""}>
                {d.date.slice(5)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Tren Registrasi 14 Hari */}
      <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-surface shadow-sm border border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
                Akuisisi Platform
              </span>
              <span className="px-2 py-0.5 rounded-full bg-role-accent-doctor/10 text-role-accent-doctor font-caption text-[11px] font-semibold">
                User & Dokter
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-ink font-semibold">
              Tren Registrasi 14 Hari
            </h3>
            <p className="font-caption text-caption text-ink-muted">
              Rasio pendaftaran pengguna reguler dan praktisi medis
            </p>
          </div>
          <div className="flex items-center gap-3 font-caption text-caption">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-role-accent-admin" />
              <span>User</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-role-accent-doctor" />
              <span>Dokter</span>
            </div>
          </div>
        </div>

        <div className="relative mt-6 pt-4">
          <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 540 160">
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="20" y2="20" />
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="70" y2="70" />
            <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="540" y1="120" y2="120" />

            {barClusters.map((cluster, idx) => (
              <g key={idx}>
                <rect
                  fill="#4338CA"
                  height={cluster.userHeight}
                  rx="3"
                  width="12"
                  x={cluster.xUser}
                  y={cluster.yUser}
                />
                <rect
                  fill="#0D9488"
                  height={cluster.doctorHeight}
                  rx="2"
                  width="8"
                  x={cluster.xDoc}
                  y={cluster.yDoc}
                />
              </g>
            ))}
          </svg>

          <div className="mt-2 flex justify-between font-caption text-caption text-ink-subtle">
            {barClusters.map((cluster, idx) => (
              <span
                key={idx}
                className={idx === barClusters.length - 1 ? "font-semibold text-role-accent-admin" : ""}
              >
                {cluster.date}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
