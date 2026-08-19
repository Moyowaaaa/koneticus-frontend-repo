"use client";

import { useEffect, useState } from "react";
import { useGetMe } from "@/api/user/user.queries";
import { mapMeUserToAuthUser } from "@/api/user/user.model";
import { useAuthStore } from "@/store/useAuthStore";
import { setAuthCookie } from "@/lib/auth-cookie";

/**
 * On app load, if a persisted token exists, refresh auth user from GET /user/me.
 * Clears stale auth on 401/failure.
 */
const AuthBootstrap = () => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  const { data, isError, isSuccess, error } = useGetMe({
    enabled: hasHydrated && !!token,
  });

  useEffect(() => {
    if (!hasHydrated || !token) return;

    // Ensure middleware-readable cookie exists after rehydrate
    setAuthCookie(token);

    if (isSuccess && data) {
      setUser(mapMeUserToAuthUser(data));
      return;
    }

    if (isError) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401 || status === 403 || status === 404) {
        clearAuth();
      }
    }
  }, [hasHydrated, token, isSuccess, isError, data, error, setUser, clearAuth]);

  return null;
};

export default AuthBootstrap;
