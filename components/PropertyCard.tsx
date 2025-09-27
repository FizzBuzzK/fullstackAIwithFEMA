import Image from 'next/image';
import Link from 'next/link';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from 'react-icons/fa';


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME; 


/**
 * ====================================================
 * @param input 
 * @returns 
 * ====================================================
 */
function normalizeImageSrc(input: unknown): string | null {

  if (typeof input !== 'string') return null;

  const s = input.trim();

  if (!s) return null;

  // Already a valid absolute or root-relative URL
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;

  // Protocol-relative (//res.cloudinary.com/...)
  if (s.startsWith('//')) return `https:${s}`;

  // Build a full secure URL
  if (CLOUD_NAME) {
    // Add any Cloudinary transforms after /upload/ (e.g., /f_auto,q_auto/)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${encodeURI(s)}`;
  }

  // Ttreat it as a file in /public
  return `/${s}`;
}


//====================================================
import type { PropertyEntity } from '@/types/property';

type Props = {
  property: PropertyEntity;
};


/**
 * ========================================================
 * Individual property card to display in Properties page 
 * @param param0 
 * @returns 
 * ========================================================
 */
export default function PropertyCard({ property }: Props) {
  
  // Handle different pricing models: monthly, weekly, or nightly
  const getRateDisplay = () => {
    
    // property is json format, so destructure to grab the rates object in it.
    const { rates } = property;
    
    if (rates.monthly) {
      return `$${rates.monthly.toLocaleString()}/mo`;
    } 
    else if (rates.weekly) {
      return `$${rates.weekly.toLocaleString()}/wk`;
    } 
    else if (rates.nightly) {
      return `$${rates.nightly.toLocaleString()}/night`;
    }
  };



  const raw = property?.images?.[0];
  const candidate = typeof raw === 'object' && raw !== null && 'url' in (raw as any) ? 
  (raw as any).url : 
  raw;

  const imgSrc = normalizeImageSrc(candidate) ?? '/placeholder.jpg';


  //========================================================
  return (
    <div className='bg-white rounded-xl shadow-2xl relative'>
      
      
      {/* Image component - Requires to set width and height
      So here, just set them to 0 and then use sizes attribute */}
      <Link href={`/properties/${property._id}`}>
        <Image src={imgSrc}
        className='w-full h-auto rounded-t-xl'
        alt='' priority={true}
        height={0} width={0} sizes='100vw'/>
      </Link>


      <div className='p-4'>
        <div className='text-left md:text-center lg:text-left mb-6'>
          <div className='text-gray-600'>{property.type}</div>
          <h3 className='text-xl font-bold'>{property.name}</h3>
        </div>

        <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-sky-700 font-bold text-right md:text-center lg:text-right'>
          {getRateDisplay()}
        </h3>

        <div className='flex justify-center gap-4 text-gray-500 mb-4'>
          <p>
            <FaBed className='md:hidden lg:inline mr-2' /> {property.beds}
            <span className='md:hidden lg:inline'> Beds</span>
          </p>
          
          <p>
            <FaBath className='md:hidden lg:inline mr-2' /> {property.baths}
            <span className='md:hidden lg:inline'> Baths</span>
          </p>

          <p>
            <FaRulerCombined className='md:hidden lg:inline  mr-2' />{' '}
            {property.square_feet}
            <span className='md:hidden lg:inline'> sqft</span>
          </p>
        </div>

        <div className='flex justify-center gap-4 text-sky-700 text-sm mb-4'>
          <p>
            <FaMoneyBill className='md:hidden lg:inline mr-2' /> Weekly
          </p>

          <p>
            <FaMoneyBill className='md:hidden lg:inline mr-2' /> Monthly
          </p>
        </div>

        <div className='border border-gray-100 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-teal-700 mt-1' />

            <span className='text-teal-700'>
              {' '} {property.location.city}, {property.location.state}
            </span>
          </div>

          <Link href={`/properties/${property._id}`}
          className='h-[36px] bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-center text-sm'>
            Details
          </Link>
        </div>
      </div>
    </div>
    
  );
  
};



