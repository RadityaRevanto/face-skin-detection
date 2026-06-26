import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type { UserRow, UsersPageData } from "./users-types";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

type GetUsersPageDataParams = {
  page?: number;
};

export async function getUsersPageData({
  page = 1,
}: GetUsersPageDataParams = {}): Promise<UsersPageData> {
  await requireAdminProfile();

  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at", {
      count: "exact",
    })
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch users:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return {
      users: [],
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  const users: UserRow[] = (data ?? []).map((user, index) => ({
    id: user.id,
    no: from + index + 1,
    username: user.full_name ?? "User",
    email: user.email ?? "-",
    join: formatDate(user.created_at),
  }));

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    users,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
