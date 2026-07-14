import type { NextAuthConfig } from "next-auth";

// Edge-safe config shared by the middleware and the full auth setup.
// No database or bcrypt here so it can run in the middleware runtime.
export const authConfig = {
  pages: { signIn: "/admin/login" },
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [], // real providers are added in auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isAdmin = path.startsWith("/admin");
      const isLogin = path === "/admin/login";
      // Guard every /admin route except the login page itself.
      if (isAdmin && !isLogin) return !!auth?.user;
      return true;
    },
  },
} satisfies NextAuthConfig;
