"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import { tokenStorage, type AuthUser } from "@/lib/api";

// Global state shared across all hook instances (pola fe-simkatmawa).
let globalCurrentUser: AuthUser | null = null;
let globalIsLoaded = false;
let globalCheckAuthPromise: Promise<AuthUser | null> | null = null;
const listeners = new Set<(user: AuthUser | null, loaded: boolean) => void>();

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(globalCurrentUser);
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded);

  useEffect(() => {
    const listener = (user: AuthUser | null, loaded: boolean) => {
      setCurrentUser(user);
      setIsLoaded(loaded);
    };
    listeners.add(listener);

    const token = tokenStorage.get();
    const cachedUser = tokenStorage.getUser();

    if (globalIsLoaded) {
      setCurrentUser(globalCurrentUser);
      setIsLoaded(true);
    } else if (token && cachedUser) {
      globalCurrentUser = cachedUser;
      globalIsLoaded = true;
      setCurrentUser(cachedUser);
      setIsLoaded(true);
    } else if (!token) {
      globalIsLoaded = true;
      setIsLoaded(true);
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateGlobalState = (user: AuthUser | null, loaded: boolean) => {
    globalCurrentUser = user;
    globalIsLoaded = loaded;
    listeners.forEach((listener) => listener(user, loaded));
  };

  const checkAuth = useCallback(async () => {
    const token = tokenStorage.get();

    if (!token) {
      updateGlobalState(null, true);
      return;
    }

    if (globalCheckAuthPromise) {
      try {
        const user = await globalCheckAuthPromise;
        if (user) {
          updateGlobalState(user, true);
        }
      } catch {
        updateGlobalState(null, true);
      }
      return;
    }

    globalCheckAuthPromise = (async () => {
      try {
        const response = await authService.me();
        if (response.data) {
          tokenStorage.set(token, response.data);
          return response.data;
        }
        tokenStorage.clear();
        return null;
      } catch {
        tokenStorage.clear();
        return null;
      }
    })();

    try {
      const user = await globalCheckAuthPromise;
      updateGlobalState(user, true);
    } finally {
      globalCheckAuthPromise = null;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Diabaikan — authService sudah membersihkan token di finally.
    } finally {
      tokenStorage.clear();
      updateGlobalState(null, false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
    } catch {
      // Diabaikan — authService sudah membersihkan token di finally.
    } finally {
      tokenStorage.clear();
      updateGlobalState(null, false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoaded,
    logout,
    logoutAll,
    checkAuth,
  };
}
