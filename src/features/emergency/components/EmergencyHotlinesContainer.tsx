"use client";

import { useState, useEffect } from "react";
import type { EmergencyHotline } from "../types";
import { getEmergencyHotlines } from "../lib/emergencyService";
import { EmergencyHotlineCard } from "./EmergencyHotlineCard";

export function EmergencyHotlinesContainer() {
  const [hotlines, setHotlines] = useState<EmergencyHotline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getEmergencyHotlines();
      setHotlines(data);
      setIsLoading(false);
    }
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (hotlines.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Hotline Darurat
          </h2>
          <p className="text-sm text-slate-500">
            Hubungi layanan darurat jika Anda membutuhkan bantuan segera
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotlines.map((hotline, index) => (
          <EmergencyHotlineCard key={index} hotline={hotline} />
        ))}
      </div>
    </div>
  );
}
