'use client';

/**
 * Server Actions:
 * Simpler, no need to create /api endpoints
 * More efficient for internal form submissions
 * Great when building a monolithic app (frontend + backend in one project)
 */
import addProperty from '@/app/actions/addProperty';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';


/**
 * ========================================================
 * @returns 
 * ========================================================
 */
export default function PropertyAddForm() {

  //========================================================
  return (

    // Server Actions
    // Submit a form directly to a server-side function
    // to extract and process form data on the server.
    <form action={addProperty}>

      <h2 className='text-3xl text-center font-semibold mb-6'>
        Add Property
      </h2>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
          Property Type
        </Label>

        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3'
          required
        >
          <option value='Apartment'>Apartment</option>
          <option value='Condo'>Condo</option>
          <option value='House'>House</option>
          <option value='CabinOrCottage'>Cabin or Cottage</option>
          <option value='Room'>Room</option>
          <option value='Studio'>Studio</option>
          <option value='Other'>Other</option>
        </select>
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label className='block text-gray-700 font-bold mb-2'>
          Listing Name
        </Label>

        <Input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='eg. Beautiful Apartment In Miami'
          required
        />
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Description
        </Label>

        <Textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows={4}
          placeholder='Add an optional description of your property'
        ></Textarea>
      </div>

      <div className='mb-4 bg-sky-50 p-4'>
        <Label className='block text-gray-700 font-bold mb-2'>
          Location
        </Label>

        <Input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Street'
        />

        <Input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          required
        />

        <Input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          required
        />

        <Input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
        />
      </div>

      <div className='bg-sky-50 p-4 mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <Label htmlFor='beds' className='block text-gray-700 font-bold mb-2'>
            Beds
          </Label>

          <Input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3'
            required
          />
        </div>

        <div className='w-full sm:w-1/3 px-2'>
          <Label htmlFor='baths' className='block text-gray-700 font-bold mb-2'>
            Baths
          </Label>

          <Input
            type='number'
            id='baths'
            name='baths'
            className='border rounded w-full py-2 px-3'
            required
          />
        </div>

        <div className='w-full sm:w-1/3 pl-2'>
          <Label
            htmlFor='square_feet'
            className='block text-gray-700 font-bold mb-2'
          >
            Square Feet
          </Label>

          <Input
            type='number'
            id='square_feet'
            name='square_feet'
            className='border rounded w-full py-2 px-3'
            required
          />
        </div>
      </div>

      <div className='mb-4 bg-sky-50 p-4'>
        <Label className='block text-gray-700 font-bold mb-2'>
          Amenities
        </Label>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-1 text-center'>
          <div>
            <Input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-1'
            />
            <Label htmlFor='amenity_wifi'>Wifi</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Full kitchen'
              className='mr-2'
            />

            <Label htmlFor='amenity_kitchen'>
              Full kitchen
            </Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Washer & Dryer'
              className='mr-2'
            />
            
            <Label htmlFor='amenity_washer_dryer'>
              Washer & Dryer
            </Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Free Parking'
              className='mr-2'
            />
            <Label htmlFor='amenity_free_parking'>Free Parking</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Swimming Pool'
              className='mr-2'
            />
            <Label htmlFor='amenity_pool'>Swimming Pool</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Hot Tub'
              className='mr-2'
            />
            <Label htmlFor='amenity_hot_tub'>Hot Tub</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='24/7 Security'
              className='mr-2'
            />
            <Label htmlFor='amenity_24_7_security'>24/7 Security</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Wheelchair Accessible'
              className='mr-2'
            />
            <Label htmlFor='amenity_wheelchair_accessible'>
              Wheelchair Accessible
            </Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              value='Elevator Access'
              className='mr-2'
            />
            <Label htmlFor='amenity_elevator_access'>Elevator Access</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Dishwasher'
              className='mr-2'
            />
            <Label htmlFor='amenity_dishwasher'>Dishwasher</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym/Fitness Center'
              className='mr-2'
            />
            <Label htmlFor='amenity_gym_fitness_center'>
              Gym/Fitness Center
            </Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Air Conditioning'
              className='mr-2'
            />
            <Label htmlFor='amenity_air_conditioning'>Air Conditioning</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcony/Patio'
              className='mr-2'
            />
            <Label htmlFor='amenity_balcony_patio'>Balcony/Patio</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2'
            />
            <Label htmlFor='amenity_smart_tv'>Smart TV</Label>
          </div>

          <div>
            <Input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Coffee Maker'
              className='mr-2'
            />
            <Label htmlFor='amenity_coffee_maker'>Coffee Maker</Label>
          </div>
        </div>
      </div>

      <div className='mb-4 bg-sky-50 p-4'>
        <Label className='block text-gray-700 font-bold mb-2'>
          Rates (Leave blank if not applicable)
        </Label>

        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex items-center'>
            <Label htmlFor='weekly_rate' className='mr-2'>
              Weekly
            </Label>

            <Input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3'
            />
          </div>

          <div className='flex items-center'>
            <Label htmlFor='monthly_rate' className='mr-2'>
              Monthly
            </Label>

            <Input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3'
            />
          </div>

          <div className='flex items-center'>
            <Label htmlFor='nightly_rate' className='mr-2'>
              Nightly
            </Label>

            <Input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3'
            />
          </div>
        </div>
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Name
        </Label>

        <Input
          type='text'
          id='seller_name'
          name='seller_info.name.'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
        />
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Email
        </Label>
        
        <Input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          required
        />
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Phone
        </Label>

        <Input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
        />
      </div>

      <div className='bg-sky-50 p-4 mb-4'>
        <Label htmlFor='images' className='block text-gray-700 font-bold mb-2'>
          Images (Select up to 4 images)
        </Label>

        <Input
          type='file'
          id='images'
          name='images'
          className='border rounded w-full py-2 px-3 hover:cursor-pointer'
          accept='image/*'
          multiple
          required
        />
      </div>

      <div className="mt-10">
        <Button
          className='bg-black text-white/80 hover:bg-stone-800 hover:text-white hover:cursor-pointer font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Add Property
        </Button>
      </div>

    </form>

  );

};


