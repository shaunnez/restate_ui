import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    try {
      const res = await createSupabaseServerClient().auth.getUser();
      // Defensive: ensure res is an object
      if (!res || typeof res !== "object") {
        console.error("auth.getUser() returned unexpected:", res);
        return { authenticated: false, logout: true, redirectTo: "/login" };
      }

      const { data, error } = res;
      const user = data?.user ?? null;

      if (error) {
        console.error("auth.getUser() error:", error);
        return { authenticated: false, logout: true, redirectTo: "/login" };
      }

      if (user) {
        return { authenticated: true };
      }

      return { authenticated: false, logout: true, redirectTo: "/login" };
    } catch (err) {
      console.error("authProviderServer.check() threw:", err);
      return { authenticated: false, logout: true, redirectTo: "/login" };
    }
  },
};
