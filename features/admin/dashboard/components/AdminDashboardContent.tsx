import Link from "next/link";

import { Card } from "@/components/ui/card";

import type { AdminDashboardData } from "@/features/admin/dashboard/lib/adminDashboardTypes";
import { DashboardIcon } from "./DashboardIcon";
import { StatusBadge } from "./StatusBadge";

const lightCardClass =
  "!border-slate-100 !bg-white !text-slate-950 shadow-sm dark:!border-slate-100 dark:!bg-white dark:!text-slate-950";

function CardHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className='flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4'>
      <div>
        <h2 className='text-sm font-semibold text-gray-900'>{title}</h2>
        <p className='mt-0.5 text-xs text-gray-400'>{description}</p>
      </div>

      {href ? (
        <Link
          href={href}
          className='shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800'
        >
          View all
        </Link>
      ) : null}
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeZone: "Asia/Jakarta",
    }).format(new Date(dateStr));
  } catch {
    return "-";
  }
}

export function AdminDashboardContent({
  stats,
  pending_actions,
  recent_verifications,
}: AdminDashboardData) {
  const statCards = [
    {
      label: "Total Users",
      value: String(stats.total_users),
      icon: "users",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Doctors",
      value: String(stats.total_doctors),
      icon: "stethoscope",
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Verifikasi Pending",
      value: String(pending_actions.doctor_verifications),
      icon: "shield",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Scans",
      value: String(stats.total_scans),
      icon: "blocked",
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Scans Hari Ini",
      value: String(stats.scans_today),
      icon: "users",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "User Baru (7 hari)",
      value: String(stats.new_users_this_week),
      icon: "stethoscope",
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Pro Subscriptions",
      value: String(stats.active_pro_subscriptions),
      icon: "shield",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Revenue Bulanan",
      value: formatCurrency(stats.monthly_revenue),
      icon: "blocked",
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className='w-full space-y-6'>
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4'>
        {statCards.map((item) => (
          <Card
            key={item.label}
            className={`overflow-visible rounded-2xl ${lightCardClass}`}
          >
            <div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6'>
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 ${item.tone}`}
              >
                <DashboardIcon name={item.icon} />
              </div>

              <div className='min-w-0 flex-1'>
                <p className='text-sm font-semibold leading-snug text-slate-500'>
                  {item.label}
                </p>
                <p className='mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-3xl'>
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
        <CardHeader
          title='Antrean Verifikasi Dokter'
          description='Dokter yang perlu direview sebelum mendapat akses dashboard dokter.'
          href='/admin/doctor-verifications/pending'
        />

        <div className='grid grid-cols-1 gap-4 p-6 lg:grid-cols-2'>
          {recent_verifications.length > 0 ? (
            recent_verifications.slice(0, 4).map((v) => (
              <Link
                key={v.uuid}
                href={`/admin/doctor-verifications/${v.uuid}`}
                className='flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5 transition-colors hover:bg-emerald-50/70'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-gray-900'>
                    {v.doctor?.full_name ?? "Dokter"}
                  </p>
                  <p className='truncate text-xs text-gray-500'>
                    {v.str_number ?? v.specialization ?? "Dokumen"} - {formatDate(v.created_at)}
                  </p>
                </div>

                <StatusBadge status={v.verification_status ?? "pending"} />
              </Link>
            ))
          ) : (
            <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
              Tidak ada antrean verifikasi dokter.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
