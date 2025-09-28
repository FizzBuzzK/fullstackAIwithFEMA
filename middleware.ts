// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // (optional) custom pages config if you use a /login route:
  // pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/properties/add",
    "/properties/saved",
    "/messages/:path*",
  ],
};


