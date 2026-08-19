export type UserDetail = {
  id: string;
  name: string;
  email: string;
  role: "user" | "doctor" | "admin";
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
};
