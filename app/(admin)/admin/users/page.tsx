import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Manajemen User | Face Skin Detection",
  description: "Kelola seluruh user terdaftar",
};

const users = [
  {
    no: 1,
    name: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    role: "User",
    join: "18 May 2025",
  },
  {
    no: 2,
    name: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    role: "User",
    join: "17 May 2025",
  },
  {
    no: 3,
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    role: "User",
    join: "15 May 2025",
  },
  {
    no: 4,
    name: "Andi Nugroho",
    email: "andi.nugroho@email.com",
    role: "Doctor",
    join: "14 May 2025",
  },
  {
    no: 5,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    role: "Admin",
    join: "13 May 2025",
  },
];

function ActionIcon({ type }: { type: "view" | "suspend" }) {
  if (type === "view") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
}

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DashboardHeader
            title="Users"
            description="Manage all registered users"
          />
          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  User Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola data user, role, tanggal bergabung, dan aksi akun.
                </p>
              </div>

              <Card className="overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                <Table className="min-w-full divide-y divide-gray-100">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        No
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Username
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Role
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Join
                      </TableHead>
                      <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 bg-white">
                    {users.map((user) => (
                      <TableRow
                        key={user.email}
                        className="group border-gray-100 transition-colors hover:bg-emerald-50/30"
                      >
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8">
                          {user.no}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-gray-700 transition-colors group-hover:text-emerald-700">
                              {user.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8">
                          {user.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8">
                          {user.join}
                          <div className="mt-1 text-xs font-normal text-gray-500">
                            Joined account
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="View"
                              className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-emerald-50! hover:text-emerald-700"
                            >
                              <ActionIcon type="view" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="Suspend"
                              className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-rose-50! hover:text-rose-600"
                            >
                              <ActionIcon type="suspend" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={1}
                  totalPages={12}
                  totalItems={60}
                  pageSize={users.length}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}