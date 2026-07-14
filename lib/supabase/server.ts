import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        // Sesi login bertahan 3 hari (lihat SESSION_MAX_AGE_SECONDS).
        maxAge: SESSION_MAX_AGE_SECONDS,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Aman untuk Server Component.
          }
        },
      },
    },
  );
}
