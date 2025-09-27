'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import deleteProperty from '@/app/actions/deleteProperty';
import { PropertyEntity } from '@/types/property';
import { Button } from './ui/button';


interface ProfilePropertiesProps {
  properties: PropertyEntity[];
}


/**
 * ========================================================
 * ProfileProperties Component
 * ========================================================
 */
export default function ProfileProperties({ properties: initialProperties }: ProfilePropertiesProps) {

  const [properties, setProperties] = useState<PropertyEntity[]>(initialProperties);


  const handleDeleteProperty = async (propertyId: string) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this property?'
    );

    if (!confirmed) return;

    const deletePropertyById = deleteProperty.bind(null, propertyId);
    await deletePropertyById();

    toast.success('Property Deleted');

    const updatedProperties = properties.filter(
      (property: PropertyEntity) => property._id !== propertyId
    );

    setProperties(updatedProperties);
  };

  //========================================================
  return properties.map((property: PropertyEntity) => (

    <div key={property._id} className="mb-10">
      <Link href={`/properties/${property._id}`}>
        <Image
          className="h-32 w-full rounded-md object-cover"
          src={property.images[0]}
          alt={property.name}
          width={500}
          height={100}
          priority={true}
        />
      </Link>

      <div className="mt-2">
        <p className="text-lg font-semibold">{property.name}</p>
        <p className="text-gray-600">
          Address: {property.location.street} {property.location.city}{' '}
          {property.location.state}
        </p>
      </div>

      <div className="mt-2">
        <Link
          href={`/properties/${property._id}/edit`}
          className="bg-sky-700 hover:bg-sky-800 text-white p-2 rounded-md mr-2 hover:cursor-pointer"
        >
          Edit
        </Link>

        <Button
          onClick={() => handleDeleteProperty(property._id)}
          className="bg-pink-200 hover:bg-pink-400 text-white p-2 rounded-md hover:cursor-pointer"
          type="button"
        >
          Delete
        </Button>

      </div>

    </div>

  ));
  
}







