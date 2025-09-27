import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import type { PropertyEntity } from "@/types/property";


/**
 * ==========================================================
 * @returns 
 * ==========================================================
 */
export default async function SavedPropertiesPage() {

  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser?.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // Populate and return plain objects, typed
  const userWithBookmarks = await User.findById(userId)
    .populate("bookmarks")
    .lean<{ bookmarks?: PropertyEntity[] }>()
    .exec();

  const bookmarks: PropertyEntity[] = userWithBookmarks?.bookmarks ?? [];

  //==========================================================
  return (
    <section className="px-4 py-6 bg-blue-50">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-2xl mb-4">Saved Properties</h1>

        {bookmarks.length === 0 ? 
        (
          <p>No saved properties</p>
        ) : 
        (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookmarks.map((property) => (
              <PropertyCard
                key={String(property._id)} // safe if _id may be ObjectId
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </section>

  );
  
}



