import Link from "next/link";

import { Card } from "@/components/ui/card";

import type { AdminDashboardData } from "../lib/admin-dashboard-types";
import { DashboardIcon } from "./dashboard-icon";
import { StatusBadge } from "./status-badge";

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

function PersonRow({
  name,
  email,
  meta,
}: {
  name: string;
  email: string;
  meta: string;
}) {
  return (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5'>
      <div className='min-w-0'>
        <p className='truncate text-sm font-semibold text-gray-900'>{name}</p>
        <p className='truncate text-xs text-gray-500'>{email}</p>
      </div>

      <span className='shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm'>
        {meta}
      </span>
    </div>
  );
}

export function AdminDashboardContent({
  stats,
  latestUsers,
  verifiedDoctors,
  userRoleSummary,
  verificationRequests,
}: AdminDashboardData) {
  return (
    <div className='w-full space-y-6'>
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4'>
        {stats.map((item) => (
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

                <p className='mt-1 text-xs text-slate-500 sm:mt-2'>
                  <span
                    className={
                      item.trend.startsWith("+")
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-rose-600"
                    }
                  >
                    {item.trend}
                  </span>{" "}
                  {item.helper}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
          <CardHeader
            title='Informasi User'
            description='Ringkasan role dan user terbaru yang terdaftar.'
            href='/admin/users'
          />

          <div className='space-y-5 p-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {userRoleSummary.map((item) => (
                <div
                  key={item.label}
                  className='rounded-xl bg-gray-50/80 p-3.5'
                >
                  <p className='text-xs text-gray-400'>{item.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${item.tone}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className='space-y-3'>
              {latestUsers.length > 0 ? (
                latestUsers.map((user) => (
                  <PersonRow
                    key={user.email}
                    name={user.name}
                    email={user.email}
                    meta={user.join}
                  />
                ))
              ) : (
                <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
                  Belum ada user terbaru.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
          <CardHeader
            title='Informasi Dokter'
            description='Dokter yang sudah diverifikasi dan aktif.'
            href='/admin/doctors'
          />

          <div className='space-y-3 p-6'>
            {verifiedDoctors.length > 0 ? (
              verifiedDoctors.map((doctor) => (
                <PersonRow
                  key={doctor.email}
                  name={doctor.name}
                  email={doctor.email}
                  meta={doctor.specialization}
                />
              ))
            ) : (
              <p className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
                Belum ada dokter terverifikasi.
              </p>
            )}
          </div>
        </Card>
      </section>

      <Card className='overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
        <CardHeader
          title='Antrean Verifikasi Dokter'
          description='Dokter yang perlu direview sebelum mendapat akses dashboard dokter.'
          href='/admin/doctor-verifications/pending'
        />

        <div className='grid grid-cols-1 gap-4 p-6 lg:grid-cols-2'>
          {verificationRequests.length > 0 ? (
            verificationRequests.slice(0, 4).map((doctor) => (
              <Link
                key={doctor.id}
                href={`/admin/doctor-verifications/${doctor.id}`}
                className='flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5 transition-colors hover:bg-emerald-50/70'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-gray-900'>
                    {doctor.name}
                  </p>
                  <p className='truncate text-xs text-gray-500'>
                    {doctor.identity} - {doctor.submittedAt}
                  </p>
                </div>

                <StatusBadge status={doctor.status} />
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
