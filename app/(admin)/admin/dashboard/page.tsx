import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/admin-header";
import { verificationRequests } from "../doctor-verifications/data";

export const metadata: Metadata = {
  title: "Dashboard Admin | Face Skin Detection",
  description: "Dashboard administrasi sistem",
};

const stats = [
  {
    label: "Total Users",
    value: "60",
    trend: "+12.5%",
    helper: "vs last month",
    tone: "bg-emerald-50 text-emerald-600",
    icon: "users",
  },
  {
    label: "Verified Doctors",
    value: "40",
    trend: "+8.2%",
    helper: "vs last month",
    tone: "bg-emerald-50 text-emerald-600",
    icon: "stethoscope",
  },
  {
    label: "Pending Verifications",
    value: "5",
    trend: "-6.7%",
    helper: "vs last month",
    tone: "bg-amber-50 text-amber-600",
    icon: "shield",
  },
  {
    label: "Suspended Accounts",
    value: "6",
    trend: "+2.1%",
    helper: "vs last month",
    tone: "bg-rose-50 text-rose-600",
    icon: "blocked",
  },
];

const lightCardClass =
  "!border-slate-100 !bg-white !text-slate-950 shadow-sm dark:!border-slate-100 dark:!bg-white dark:!text-slate-950";

const latestUsers = [
  {
    name: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    role: "User",
    join: "18 May 2025",
  },
  {
    name: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    role: "User",
    join: "17 May 2025",
  },
  {
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    role: "User",
    join: "15 May 2025",
  },
];

const verifiedDoctors = [
  {
    name: "dr. Amanda Putri",
    email: "amanda.putri@email.com",
    specialization: "Dermatologi",
    verifiedAt: "18 May 2025",
  },
  {
    name: "dr. Budi Santoso",
    email: "budi.santoso@email.com",
    specialization: "Spesialis Kulit",
    verifiedAt: "17 May 2025",
  },
  {
    name: "dr. Citra Melati",
    email: "citra.melati@email.com",
    specialization: "Dermatologi",
    verifiedAt: "15 May 2025",
  },
];

const userRoleSummary = [
  { label: "Regular Users", value: "52", tone: "text-emerald-700" },
  { label: "Doctors", value: "7", tone: "text-sky-700" },
  { label: "Admins", value: "1", tone: "text-violet-700" },
];

function DashboardIcon({ name }: { name: string }) {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
  } as const;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      {name === "users" ? (
        <>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...common} />
          <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...common} />
          <path d="M20 19c0-1.7-1-3.1-2.5-3.7" {...common} />
          <path d="M15.5 5.3a3 3 0 0 1 0 5.4" {...common} />
        </>
      ) : null}
      {name === "stethoscope" ? (
        <>
          <path d="M7 4v5a5 5 0 0 0 10 0V4" {...common} />
          <path d="M7 4H5" {...common} />
          <path d="M17 4h2" {...common} />
          <path d="M12 14v2a4 4 0 0 0 8 0v-1" {...common} />
          <path d="M20 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...common} />
        </>
      ) : null}
      {name === "shield" ? (
        <>
          <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" {...common} />
          <path d="m9 12 2 2 4-4" {...common} />
        </>
      ) : null}
      {name === "blocked" ? (
        <>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...common} />
          <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...common} />
          <path d="m17 8 4 4" {...common} />
          <path d="m21 8-4 4" {...common} />
        </>
      ) : null}
      {name === "leaf" ? (
        <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0 8-8" {...common} />
      ) : null}
      {name === "box" ? (
        <>
          <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" {...common} />
          <path d="M4 7.5v9L12 21l8-4.5v-9" {...common} />
          <path d="M12 12v9" {...common} />
        </>
      ) : null}
      {name === "star" ? (
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" {...common} />
      ) : null}
      {name === "flask" ? (
        <>
          <path d="M9 3h6" {...common} />
          <path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" {...common} />
          <path d="M8 15h8" {...common} />
        </>
      ) : null}
      {name === "settings" ? (
        <>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...common} />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 3h5l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" {...common} />
        </>
      ) : null}
    </svg>
  );
}

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
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
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
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
        <p className="truncate text-xs text-gray-500">{email}</p>
      </div>
      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
        {meta}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Revision Required") {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Revision
      </span>
    );
  }

  return (
    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
      Pending
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-slate-950 dark:bg-[#f7fbf8] dark:text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <DashboardHeader
            title="Dashboard"
            description="Welcome back, Admin! Here's what's happening today."
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {stats.map((item) => (
                  <Card
                    key={item.label}
                    className={`overflow-visible rounded-2xl ${lightCardClass}`}
                  >
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 ${item.tone}`}
                      >
                        <DashboardIcon name={item.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-3xl">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 sm:mt-2">
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

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                  <CardHeader
                    title="Informasi User"
                    description="Ringkasan role dan user terbaru yang terdaftar."
                    href="/admin/users"
                  />
                  <div className="space-y-5 p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {userRoleSummary.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl bg-gray-50/80 p-3.5"
                        >
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className={`mt-1 text-2xl font-bold ${item.tone}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {latestUsers.map((user) => (
                        <PersonRow
                          key={user.email}
                          name={user.name}
                          email={user.email}
                          meta={user.join}
                        />
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                  <CardHeader
                    title="Informasi Dokter"
                    description="Dokter yang sudah diverifikasi dan aktif."
                    href="/admin/doctors"
                  />
                  <div className="space-y-3 p-6">
                    {verifiedDoctors.map((doctor) => (
                      <PersonRow
                        key={doctor.email}
                        name={doctor.name}
                        email={doctor.email}
                        meta={doctor.specialization}
                      />
                    ))}
                  </div>
                </Card>
              </section>

              <Card className="overflow-hidden rounded-3xl border-gray-100! bg-white! text-slate-950! shadow-sm dark:border-gray-100! dark:bg-white! dark:text-slate-950!">
                <CardHeader
                  title="Antrean Verifikasi Dokter"
                  description="Dokter yang perlu direview sebelum mendapat akses dashboard dokter."
                  href="/admin/doctor-verifications"
                />
                <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
                  {verificationRequests.slice(0, 4).map((doctor) => (
                    <Link
                      key={doctor.email}
                      href={`/admin/doctor-verifications/${doctor.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl bg-gray-50/80 p-3.5 transition-colors hover:bg-emerald-50/70"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {doctor.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {doctor.identity} - {doctor.submittedAt}
                        </p>
                      </div>
                      <StatusBadge status={doctor.status} />
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}