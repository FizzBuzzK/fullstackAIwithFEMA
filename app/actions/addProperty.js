'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';


/**
 * ========================================================
 * Server Actions:
 * Simpler, no need to create /api endpoints
 * More efficient for internal form submissions
 * Great when building a monolithic app (frontend + backend in one project)
 * The formData object contains all fields from the submitted form.
 * @param {*} formData 
 * ========================================================
 */
export default async function addProperty(formData) {
  
  // Submit Property to Database
  await connectDB();

  // Get the logged-in user's session info
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;


  // Format Property Data
  const amenities = formData.getAll('amenities');


  // Cloudinary Image Upload
  const images = formData.getAll('images').filter((image) => image.name !== '');


  // Format Property Data
  const propertyData = {
    type: formData.get('type'),
    name: formData.get('name'),
    description: formData.get('description'),

    location: {
      street: formData.get('location.street'),
      city: formData.get('location.city'),
      state: formData.get('location.state'),
      zipcode: formData.get('location.zipcode'),
    },

    beds: formData.get('beds'),
    baths: formData.get('baths'),
    square_feet: formData.get('square_feet'),

    amenities,

    rates: {
      weekly: formData.get('rates.weekly'),
      monthly: formData.get('rates.monthly'),
      nightly: formData.get('rates.nightly.'),
    },

    seller_info: {
      name: formData.get('seller_info.name'),
      email: formData.get('seller_info.email'),
      phone: formData.get('seller_info.phone'),
    },

    owner: userId,

  };



  // Cloudinary Image Upload
  const imageUrls = [];

  for (const imageFile of images) {
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    const imageBase64 = imageData.toString('base64');

    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: 'safehaven',
      }
    );

    imageUrls.push(result.secure_url);
    
  }

  propertyData.images = imageUrls;



  // Submit Property to Database
  const newProperty = new Property(propertyData);

  // Persists the document to MongoDB
  await newProperty.save();


  // Update the cache and update the listings once we submit it
  revalidatePath('/', 'layout');

  
  // Programmatically sends the user to a different route
  redirect(`/properties/${newProperty._id}`);

  
}





