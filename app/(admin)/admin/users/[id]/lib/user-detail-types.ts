export type UserDetail = {
  id: string;
  username: string;
  email: string;
  role: "user";
  avatarUrl: string | null;
  isActive: boolean;
  joinedAt: string;
};
