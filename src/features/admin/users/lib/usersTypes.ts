import type { PagePagination } from "@/lib/types/pagination";

export type UserRow = {
  id: string;
  no: number;
  username: string;
  email: string;
  join: string;
  gender: string;
  age: number | string;
};

export type UsersPageData = {
  users: UserRow[];
  pagination: PagePagination;
};
