import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import connectDB from '@/config/database';
import Property from '@/models/Property';

import type { PropertyEntity } from '@/types/property';
import type { Types } from 'mongoose';


type MongoPropertyLean = Omit<PropertyEntity, '_id' | 'owner'> & {
  _id: Types.ObjectId;
  owner: Types.ObjectId; // adjust if you sometimes .populate()
  __v?: number;
};


/**
 * ==========================================================
 * @returns 
 * ==========================================================
 */
export default async function FeaturedProperties() {

  await connectDB();

  // Get raw Mongo docs with ObjectIds
  const docs = await Property.find({ is_featured: true }).lean<MongoPropertyLean[]>();

  // Convert to your UI-friendly shape
  const properties: PropertyEntity[] = docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
    owner: d.owner.toString(),
  }));

  //==========================================================
  return properties.length > 0 ? 
  (
    <section className="bg-blue-50 px-4 pt-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <FeaturedPropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </section>
  ) : 
  null;

}



