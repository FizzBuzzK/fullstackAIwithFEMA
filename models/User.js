// models/User.js


import { Schema, model, models } from 'mongoose';


/**
 * ========================================================
 * Create a schema for User model to define fields such as email and username.
 * Schema defines the structure, types, and rules for documents stored in MongoDB collections.
 * Model is a compiled version of a schema, representing a collection in MongoDB.
 * ========================================================
 */
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
    },

    image: {
      type: String,
    },

    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  
  {
    timestamps: true,
  }
);


//========================================================
const User = models.User || model('User', UserSchema);


//========================================================
export default User;



