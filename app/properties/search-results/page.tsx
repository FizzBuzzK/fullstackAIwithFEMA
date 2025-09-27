import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import Property from "@/models/Property"; // ← lowercase "property" matches your file
import { convertToSerializeableObject } from "@/utils/convertToObject";

import type { FilterQuery } from "mongoose";
import type { IProperty, PropertyEntity } from "@/types/property";
import Hero from "@/components/Hero";


type Props = {
  searchParams: Promise<{ location?: string; propertyType?: string }>;
};


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default async function SearchResultsPage({ searchParams }: Props) {
  await connectDB();

  const params = await searchParams;
  const location = params?.location?.trim() ?? "";
  const propertyType = params?.propertyType?.trim() ?? "All";

  const query: FilterQuery<IProperty> = {};

  if (location) {
    query.$text = { $search: location };
  }

  if (propertyType && propertyType !== "All") {
    query.type = propertyType;
  }

  const cursor = Property.find(query)
    .sort({ createdAt: -1 })
    .collation({ locale: "en", strength: 2 }) // case-insensitive type match
    .lean<PropertyEntity[]>();

  if (location) {
    cursor.sort({ score: { $meta: "textScore" } }).select({ score: { $meta: "textScore" } });
  }

  const propertiesQueryResults = await cursor.exec();

  const properties =
    (convertToSerializeableObject(propertiesQueryResults) as PropertyEntity[]) ?? [];

  return (
    <>
      <Hero />

      <section className="px-4 py-6 bg-gradient-to-b from-sky-700 to-slate-100">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-50 mb-20 text-center">Search Results</h1>

          <Link
            href="/properties"
            className="flex items-center text-xl font-bold text-slate-50 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
          </Link>

          {properties.length === 0 ? 
          (
            <p>No search results found</p>
          ) : 
          (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={String(property._id)} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>

  );

}

