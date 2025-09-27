import connectDB from '@/config/database';
import User from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions, Profile, Session } from 'next-auth';


/**
 * ========================================================
 * Next Auth & Provider Setup
 * ========================================================
 */
export const authOptions: NextAuthOptions = {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  //===================
  callbacks: {
    /**
     * ===========================
     * Save User to Database & Session
     * ===========================
     */
    async signIn({ profile }: { profile?: Profile }) {
      if (!profile) return false;

      // 1. Connect to DB
      await connectDB();

      // 2. Check if user exists
      const userExists = await User.findOne({ email: profile.email });

      // 3. If not, create user in database
      if (!userExists) {
        const username = profile.name?.slice(0, 20) ?? 'User';

        await User.create({
          email: profile.email,
          username,
          image: (profile as any).picture, // Google's profile has "picture"
        });
      }

      return true;
    },

    /**
     * ===========================
     * Attach MongoDB _id to Session
     * ===========================
     */
    async session({ session }: { session: Session }) {
      if (!session.user?.email) return session;

      const user = await User.findOne({ email: session.user.email });

      if (user) {
        // Extend session.user with id
        (session.user as Session['user'] & { id: string }).id =
          user._id.toString();
      }

      return session;
    },
  },
};



