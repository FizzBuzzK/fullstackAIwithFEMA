'use client';
import { SessionProvider } from 'next-auth/react';

/**
 * ========================================================
 * SessionProvider from 'next-auth/react' should be used within a client component in Next.js applications using the App Router.
 * Wrap the entire app in session context in a SessionProvider from NextAuth to manage user sessions.
 * Instead converting the layout into a client component, 
 * separate the session logic into its own client-side component.
 * @param param0 
 * @returns 
 * ========================================================
 */
export default function AuthProvider({ children }: any) {

  return <SessionProvider>{children}</SessionProvider>;
  
};





