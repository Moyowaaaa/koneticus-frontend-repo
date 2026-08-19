const AUTH_COOKIE_NAME = "authToken";
const AUTH_COOKIE_MAX_AGE = 2 * 24 * 60 * 60; // 2 days — matches backend JWT

/** Client-readable cookie so Next.js middleware can gate routes */
export const setAuthCookie = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const clearAuthCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};
