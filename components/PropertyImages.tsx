'use client';

import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';

type Props = { images: string[] };


/**
 * ======================================================
 * @param val 
 * @returns 
 * ======================================================
 */
function safeSrc(val?: string) {
  const s = (val ?? '').trim();

  if (!s) return '/placeholder.jpg';

  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;

  return '/placeholder.jpg';
}


/**
 * ======================================================
 * @param param0 
 * @returns 
 * ======================================================
 */
export default function PropertyImages({ images }: Props) {

  const normalized = (images ?? []).map(safeSrc);

  //======================================================
  return (
    <Gallery>
      <section className="bg-blue-50 p-4">
        <div className="container mx-auto">
          {normalized.length === 1 ? 
          (
            <Item original={normalized[0]} thumbnail={normalized[0]} width={1200} height={600}>
              {({ ref, open }) => (
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Use aspect ratio for mobile friendliness */}
                  <div className="relative w-full aspect-[16/9] md:h-[600px] md:aspect-auto">
                    <Image
                      ref={ref as any}
                      onClick={open}
                      src={normalized[0]}
                      alt=""
                      fill
                      className="object-cover cursor-pointer"
                      sizes="(max-width: 768px) 100vw, 100vw"
                      priority
                    />
                  </div>
                </div>
              )}
            </Item>
          ) : 
          (
            // 1 column on mobile, 2 columns from md and up
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normalized.map((src, index) => (
                <div
                  key={index}
                  // If exactly 3 images, make the last one span 2 cols only on md+
                  className={normalized.length === 3 && index === 2 ? 'md:col-span-2' : ''}
                >
                  <Item original={src} thumbnail={src} width={1200} height={600}>
                    {({ ref, open }) => (
                      <div className="relative rounded-3xl overflow-hidden">
                        <div className="relative w-full aspect-[16/9] md:h-[600px] md:aspect-auto">
                          <Image
                            ref={ref as any}
                            onClick={open}
                            src={src}
                            alt=""
                            fill
                            className="object-cover w-full cursor-pointer"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index < 2}
                          />
                        </div>
                      </div>
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </Gallery>

  );
  
}




