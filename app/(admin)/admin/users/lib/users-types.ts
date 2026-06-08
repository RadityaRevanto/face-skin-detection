export type UserRow = {
  id: string;
  no: number;
  username: string;
  email: string;
  join: string;
};

export type UsersPageData = {
  users: UserRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
