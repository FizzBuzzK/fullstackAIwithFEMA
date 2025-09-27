// 4-30. Next Auth & Provider Setup
import { authOptions } from '@/utils/authOptions';
import NextAuth from 'next-auth/next';


/**
 * ========================================================
 * This is a catch-all route to handle all /api/auth/* requests.
 * NextAuth uses API Routes to manage signIn, signOut, getSession, etc.
 * Whenever GET request or POST request is made to api/auth,
 * basically this is going to take over.
 * ========================================================
 */
const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };

