import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import Property from "@/models/Property";
import connectDB from "@/config/database";
import type { PropertyEntity } from "@/types/property";
import Hero from "@/components/Hero";

type Props = {
  // Next 15: searchParams must be awaited
  searchParams: Promise<{
    pageSize?: string | string[];
    page?: string | string[];
  }>;
};

/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default async function PropertiesPage({ searchParams }: Props) {
  await connectDB();

  const sp = await searchParams;
  const pageNum = Number(sp?.page ?? "1");
  const pageSizeNum = Number(sp?.pageSize ?? "9");

  const skip = (pageNum - 1) * pageSizeNum;

  const total = await Property.countDocuments({});
  const properties = await Property.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSizeNum)
    .lean<PropertyEntity[]>()
    .exec();

  const showPagination = total > pageSizeNum;

  //==========================================================
  return (
    <>
      <Hero />

      <section className="bg-gradient-to-b from-sky-700 to-slate-100 px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-50 mb-20 text-center">
            Browse Properties
          </h1>

          {properties.length === 0 ? 
          (
            <p>No properties found</p>
          ) : 
          (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property: PropertyEntity) => (
                <PropertyCard
                  key={String(property._id)}
                  property={property}
                />
              ))}
            </div>
          )}

          {showPagination && (
            <Pagination
              page={pageNum}
              pageSize={pageSizeNum}
              totalItems={total}
            />
          )}
        </div>
      </section>
    </>

  );
  
}




