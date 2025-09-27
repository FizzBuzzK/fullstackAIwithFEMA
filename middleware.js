export { default } from 'next-auth/middleware';

/**
 * A file that allows logic to run before route loads.
 * To protect only certain pages, add a config export with a matcher array.
 * NextAuth provides a built-in middleware helper that:
 * checks if a user is authenticated,
 * redirects unauthenticated users to the sign-in page automatically.
 * 
 * Middleware Flow 
 * 1. [User requests /property/add]
 * 2. middleware.js intercepts request
 * 3. is user authenticated?
 * 4. Yes → allow request
 * 5. No  → redirect to /api/auth/signin
 */
export const config = {
  // Array of route patterns to protect
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
};
