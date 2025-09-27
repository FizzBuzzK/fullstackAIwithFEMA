import PropertyEditForm from '@/components/PropertyEditForm';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import type { PropertyEntity } from '@/types/property';
import type { Types } from 'mongoose';


interface PropertyPageProps {
  params: { id: string };
}


// Shape returned by .lean() (ObjectIds, may include __v)
type MongoPropertyLean = Omit<PropertyEntity, '_id' | 'owner'> & {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  __v?: number;
};


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default async function PropertyEditPage({ params }: PropertyPageProps) {
  await connectDB();

  const doc = await Property.findById(params.id).lean<MongoPropertyLean | null>();

  if (!doc) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  // Normalize to UI-friendly entity
  const property: PropertyEntity = {
    ...doc,
    _id: doc._id.toString(),
    owner: doc.owner.toString(),
  };

  //==========================================================
  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
}





