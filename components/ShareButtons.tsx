'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

import type { PropertyEntity } from '@/types/property';

type Props = {
  property: PropertyEntity;
};


/**
 * ==============================================================
 * @param param0 
 * @returns 
 * ==============================================================
 */
export default function ShareButtons({ property }: Props) {

  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;
  const tag = `${property.type.replace(/\s/g, '')}ForRent`;

  //==============================================================
  return (
    <>
      <h3 className="text-xl font-bold text-center mt-5 p-5">Share This Property:</h3>

      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton url={shareUrl} hashtag={`#${tag}`}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={property.name} hashtags={[tag]}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={property.name} separator=":: ">
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>
    </>
  );
}





