'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';


type Props = { items: string[] };


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export function HomeCarousel({ items = [] }: Props) {

  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const toSrc = (s?: string | null) =>
    (typeof s === 'string' ? s.trim() : '') || '/placeholder.jpg';

  if (!items.length) {
    // Optional: render nothing or a placeholder slide
    return null;
  }

  //==========================================================
  return (
    <Carousel
      dir="ltr"
      plugins={[plugin.current]}
      className="w-full mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item, idx) => {
          const src = toSrc(item);
          return (
            <CarouselItem key={idx}>
              <div className="px-20 rounded-3xl shadow-2xl flex aspect-[16/6] items-center justify-center p-6 relative">
                <Image
                  src={src}                
                  alt={`Header Image ${idx + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={idx === 0}     // only the first image is priority
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="left-0 md:left-12 hover:cursor-pointer" />
      <CarouselNext className="right-0 md:right-12 hover:cursor-pointer" />

    </Carousel>

  );

}

