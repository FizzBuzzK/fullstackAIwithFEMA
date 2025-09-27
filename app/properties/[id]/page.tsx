import PropertyDetails from '@/components/PropertyDetails';
import PropertyImages from '@/components/PropertyImages';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import PropertyContactForm from '@/components/PropertyContactForm';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { PropertyEntity } from '@/types/property';
import { HomeCarousel } from '@/components/HomeCarousel';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}


/**
 * ==========================================================
 * @param input 
 * @returns 
 * ==========================================================
 */
function toCloudinaryUrl(input?: string | null): string {
  if (!input) return '/placeholder.jpg';

  const s = String(input).trim();

  if (!s) return '/placeholder.jpg';

  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;

  // Treat as Cloudinary public_id like "folder/f1.jpg"
  const cloud = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  //==========================================================
  return cloud ? 
  `https://res.cloudinary.com/${cloud}/image/upload/${encodeURI(s)}` : 
  `/${s}`;
}


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default async function PropertyPage({ params }: PropertyPageProps) {

  await connectDB();
  const { id } = await params;

  const doc = await Property.findById(id).lean();

  if (!doc) {
    return <h1 className="text-center text-2xl font-bold mt-10">Property Not Found</h1>;
  }

  const raw = convertToSerializeableObject<PropertyEntity>(doc);

  // Build FULL URLs on the server
  const property: PropertyEntity = {
    ...raw,
    images: Array.isArray(raw.images) ? raw.images.map(toCloudinaryUrl) : [],
  };

  //==========================================================
  return (
    <>
      <section className="bg-gradient-to-b from-slate-100 to-sky-800 py-20">
          <HomeCarousel items={property.images} />
      </section>

      <section className="bg-gradient-to-b from-sky-800 to-slate-100 pb-20">
        <div className="container m-auto py-5 px-5">
          <Link href="/properties" className="text-xl font-bold text-slate-50 hover:underline flex items-center">
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Link>
        </div>

        <div className="container m-auto">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <PropertyDetails property={property} />
            <aside className="space-y-4">
              <BookmarkButton property={property} />
              <ShareButtons property={property} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>

      <PropertyImages images={property.images} />
    </>

  );
  
}

