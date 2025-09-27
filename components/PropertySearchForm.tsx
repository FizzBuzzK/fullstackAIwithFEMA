'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';


/**
 * ========================================================
 * @returns
 * ========================================================
 */
export default function PropertySearchForm() {
  
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All');

  const router = useRouter();


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(location === '' && propertyType === 'All'){
      router.push('/properties');
    } 
    else{
      const query = `?location=${location}&propertyType=${propertyType}`;
      router.push(`/properties/search-results${query}`);
    }
  };


  //======================================================
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
        <Label htmlFor="location" className="sr-only">
          Location
        </Label>

        <Input
          type="text"
          id="location"
          placeholder="Enter Keywords or Location"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800"
          value={location}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setLocation(e.target.value)
          }
        />
      </div>

      <div className="w-full md:w-2/5 md:pl-2">
        <Label htmlFor="property-type" className="sr-only">
          Property Type
        </Label>

        <select
          id="property-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800"
          value={propertyType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPropertyType(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Apartment">Apartment</option>
          <option value="Studio">Studio</option>
          <option value="Condo">Condo</option>
          <option value="House">House</option>
          <option value="Cabin Or Cottage">Cabin or Cottage</option>
          <option value="Loft">Loft</option>
          <option value="Room">Room</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <Button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-sky-700 text-white hover:bg-sky-800 hover:cursor-pointer"
      >
        Search
      </Button>
    </form>

  );

}



