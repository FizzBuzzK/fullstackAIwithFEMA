import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/utils/authOptions";

/**
 * ===============================================================
 * Local, strongly-typed session shape with user.id (no global augmentation needed).
 * ===============================================================
 */
export type SessionWithId = Session & {
  user: NonNullable<Session["user"]> & { id: string };
};

export interface SessionUser {
  user: SessionWithId["user"];
  userId: string;
}

/**
 * Get the logged-in user (server-side).
 * Returns null if not authenticated or id missing.
 */
export async function getSessionUser(): Promise<SessionUser | null> {

  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  const id = (session.user as any).id as string | undefined;

  if (!id) return null;

  //===============================================================
  return {
    user: { ...(session.user as object), id } as SessionWithId["user"],
    userId: id,
  };

}

