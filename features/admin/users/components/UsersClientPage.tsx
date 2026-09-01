"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { UsersContent } from "./UsersContent";
import type { UsersPageData } from "../lib/usersTypes";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function formatGender(gender: string | null | undefined) {
  if (!gender) return "-";
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  return gender;
}

function UsersPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: async () => {
      const response = await adminService.users({
        role: "user",
        page,
        per_page: PAGE_SIZE,
      });
      return response as unknown as {
        data: {
          uuid: string;
          id?: string;
          full_name: string;
          email: string;
          created_at: string;
          gender?: string;
          age?: number | string;
        }[];
        meta: { last_page: number; total: number };
      };
    },
    placeholderData: keepPreviousData,
  });

  const pageData: UsersPageData = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;

    const users = (data?.data ?? []).map((user, index) => ({
      id: user.uuid || (user.id ?? ""),
      no: from + index + 1,
      username: user.full_name ?? "User",
      email: user.email ?? "-",
      join: formatDate(user.created_at),
      gender: formatGender(user.gender),
      age: user.age ?? "-",
    }));

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: "/admin/users",
        itemLabel: "user",
      },
    };
  }, [data, page]);

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return <UsersContent {...pageData} />;
}

export function UsersClientPage() {
  return (
    <Suspense>
      <UsersPageInner />
    </Suspense>
  );
}
