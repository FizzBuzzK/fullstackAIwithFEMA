import mongoose from 'mongoose';

// Tracks DB connection state to prevent duplicate connections
let connected = false;

/**
 * ========================================================
 * Set up a reusable database connection utility 
 * Use it to interact with MongoDB 
 * (e.g., server components, API routes, actions)
 * @returns 
 * ========================================================
 */
export default async function connectDB() {
  
  // Optional config to suppress deprecation warnings
  mongoose.set('strictQuery', true);

  
  //========================================================
  // Avoid duplicate connections
  if(connected) {
    console.log('MongoDB is already connected...');
    return;
  }

  
  // Use Mongoose to connect this app to MongoDB Atlas via a .env connection string
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log('MongoDB connected...');
  } 
  catch(error) {
    console.log(error);
  }
  
};




