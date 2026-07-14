import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Protects /admin/* (except /admin/login) via the edge-safe config.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
