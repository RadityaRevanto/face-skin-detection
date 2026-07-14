import { createBrowserClient } from "@supabase/ssr";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        // Sesi login bertahan 3 hari (lihat SESSION_MAX_AGE_SECONDS).
        maxAge: SESSION_MAX_AGE_SECONDS,
      },
    },
  );
}
