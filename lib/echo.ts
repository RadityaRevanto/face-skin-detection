import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally for Laravel Echo
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo<any> | null = null;

export const getEcho = (): Echo<any> => {
  if (typeof window === "undefined") {
    // Return a dummy object or throw on server side if needed
    // But usually getEcho is only called in useEffect
    return null as unknown as Echo<any>;
  }

  if (!echoInstance) {
    echoInstance = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "skincekkey",
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: "/api/broadcasting/auth",
      // If CSRF is needed, we don't have it since we use Bearer tokens via our proxy, 
      // but we don't even need to pass token here because the proxy will attach the token!
    });
  }

  return echoInstance;
};
