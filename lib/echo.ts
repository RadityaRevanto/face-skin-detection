/* eslint-disable @typescript-eslint/no-explicit-any */
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { tokenStorage } from "@/lib/api";

type BroadcastAuthData = {
  auth: string;
  channel_data?: string;
  shared_secret?: string;
};

let echoInstance: Echo<any> | null = null;

const resolveAuthEndpoint = (): string => {
  const override = process.env.NEXT_PUBLIC_REVERB_AUTH_ENDPOINT;
  if (override) return override;

  // Endpoint broadcasting BE berada di bawah /api/v1 (NEXT_PUBLIC_API_URL).
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl ? `${apiUrl.replace(/\/$/, "")}/broadcasting/auth` : "/broadcasting/auth";
};

/**
 * Laravel Echo (broadcaster Reverb) untuk notifikasi real-time.
 *
 * Echo & Pusher menyentuh `window`, jadi instance dibuat lazy di sisi client
 * lewat `getEcho()` (jangan diinisialisasi saat SSR). Autentikasi private
 * channel memakai Sanctum Bearer token yang sama dengan REST API.
 */
export function getEcho(): Echo<any> | null {
  if (typeof window === "undefined") return null;
  if (echoInstance) return echoInstance;

  // Pusher dibutuhkan oleh Echo sebagai transport layer.
  (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

  echoInstance = new Echo<any>({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "skincekkey",
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT
      ? Number(process.env.NEXT_PUBLIC_REVERB_PORT)
      : 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT
      ? Number(process.env.NEXT_PUBLIC_REVERB_PORT)
      : 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (channel: { name: string }) => ({
      authorize: (
        socketId: string,
        callback: (error: Error | null, data: BroadcastAuthData | null) => void,
      ) => {
        fetch(resolveAuthEndpoint(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenStorage.get() ?? ""}`,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((res) => res.json())
          .then((data) => callback(null, data as BroadcastAuthData))
          .catch((err) => callback(err as Error, null));
      },
    }),
  });

  return echoInstance;
}

/** Tutup koneksi WebSocket (mis. saat logout). */
export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
