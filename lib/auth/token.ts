import { cookies } from "next/headers";

const TOKEN_NAME = "auth_token";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function setUserRole(role: string, status: string) {
  const cookieStore = await cookies();
  cookieStore.set("user_role", role, { path: "/", maxAge: 30 * 24 * 60 * 60 });
  cookieStore.set("user_status", status, { path: "/", maxAge: 30 * 24 * 60 * 60 });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  cookieStore.delete("user_role");
  cookieStore.delete("user_status");
}
