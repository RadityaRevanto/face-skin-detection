import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ROUTES } from "@/lib/constants";

import type { UserRow, UsersPageData } from "./usersTypes";

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

function formatGender(gender: string | null | undefined) {
  if (!gender) return "-";
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  return gender;
}

interface UserApi {
  id: string;
  uuid: string;
  full_name: string;
  email: string;
  created_at: string;
  gender?: string;
  age?: number | string;
}

type GetUsersPageDataParams = {
  page?: number;
  search?: string;
};

export async function getUsersPageData({
  page = 1,
  search = "",
}: GetUsersPageDataParams = {}): Promise<UsersPageData> {
  await requireAdminProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const searchQuery = search ? `&search=${search}` : "";

  try {
    const res = await fetchApi<UserApi[]>(
      `/admin/users?role=user&page=${safePage}&per_page=${PAGE_SIZE}${searchQuery}`,
    );

    const users: UserRow[] = (res.data ?? []).map((user: UserApi, index: number) => ({
      id: user.uuid || user.id,
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
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.ADMIN.USERS,
        itemLabel: "user",
      },
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return {
      users: [],
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.ADMIN.USERS,
        itemLabel: "user",
      },
    };
  }
}
